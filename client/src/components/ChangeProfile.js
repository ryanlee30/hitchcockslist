import '../App.css'
import { Component } from 'react';
import { Form, Alert } from 'react-bootstrap';
import AvatarEditor from 'react-avatar-editor'
import { firebase } from '../firebase';

export default class ChangeProfile extends Component {
    constructor() {
        super();
        this.state = {
            firstName: "",
            lastName: "",
            image: "",
            preview: null,
            scale: 1.2,
            width: 195,
            height: 195,
            borderRadius: 999,
            postion: { x: 0.5, y: 0.5 },
        }
        this.persistData = this.persistData.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleNewImage = e => {
        this.setState({ image: e.target.files[0] });
    }

    setEditorRef = editor => {
        if (editor) this.editor = editor;
    }

    handleSave() {
        const img = this.editor.getImageScaledToCanvas().toDataURL();
        const rect = this.editor.getCroppingRect();
    
        return {
          preview: {
            img,
            rect,
            scale: this.state.scale,
            width: this.state.width,
            height: this.state.height,
            borderRadius: this.state.borderRadius,
          }
        }
    }

    logCallback(e) {
        // eslint-disable-next-line no-console
        console.log('callback', e);
    }

    persistData() {
        if (this.props.uid) {
            const db = firebase.firestore();
            db.collection('users').doc(this.props.uid).update({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                profilePicture: this.handleSave()
            });
        } else {
            console.log("Could not find uid!");
        }
    }

    render() {
        return (
            <div>
                <h5>Your Profile</h5>
                <p style={{marginTop: "20px"}}>Name</p>
                <Form.Group controlId="formChangeFirstName">
                  <Form.Control type="text" placeholder="First name" autoComplete="off" onChange={e => this.setState({ firstName: e.target.value })}/>
                </Form.Group>
                <Form.Group controlId="formChangeLastName">
                    <Form.Control type="text" placeholder="Last name" autoComplete="off" onChange={e => this.setState({ lastName: e.target.value })}/>
                </Form.Group>
                <p style={{marginTop: "40px"}}>Profile Picture</p>
                <AvatarEditor
                    ref={this.setEditorRef}
                    image={this.state.image}
                    width={this.state.width}
                    height={this.state.height}
                    borderRadius={this.state.borderRadius}
                    scale={this.state.scale}
                    onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
                    color={[50,50,50, 0.6]}
                />
                <label class="upload-pp" for="upload-pp">
                    Upload a photo
                </label>
                <input id="upload-pp" style={{marginTop: "15px", display: "none"}} name="newImage" type="file" onChange={this.handleNewImage} />
                <p style={{fontSize: "17px", cursor: "pointer", width: "100px", float: "right", marginTop: "45px"}} onClick={this.persistData}>Update Profile</p>
            </div>
        )
    }
}