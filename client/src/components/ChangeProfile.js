import '../App.css'
import { Component } from 'react';
import { Form, Alert } from 'react-bootstrap';
// import AvatarEditor from 'react-avatar-editor'
import { firebase } from '../firebase';

export default class ChangeProfile extends Component {
    constructor() {
        super();
        this.state = {
            errors: {},
            form: {first_name: "", last_name: ""},
            // image: "",
            // preview: null,
            // scale: 1.2,
            // width: 195,
            // height: 195,
            // borderRadius: 999,
            // postion: { x: 0.5, y: 0.5 },
        }
        this.setField = this.setField.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        // this.handleSave = this.handleSave.bind(this);
    }

    // handleNewImage = e => {
    //     this.setState({ image: e.target.files[0] });
    // }

    // setEditorRef = editor => {
    //     if (editor) this.editor = editor;
    // }

    // handleSave() {
    //     const img = this.editor.getImageScaledToCanvas().toDataURL();
    //     const rect = this.editor.getCroppingRect();
    
    //     return {
    //       preview: {
    //         img,
    //         rect,
    //         scale: this.state.scale,
    //         width: this.state.width,
    //         height: this.state.height,
    //         borderRadius: this.state.borderRadius,
    //       }
    //     }
    // }

    // logCallback(e) {
    //     // eslint-disable-next-line no-console
    //     console.log('callback', e);
    // }

    persistData() {
        if (this.props.uid) {
            const db = firebase.firestore();
            db.collection('users').doc(this.props.uid).update({
                firstName: this.state.form.first_name,
                lastName: this.state.form.last_name,
                // profilePicture: this.handleSave()
            });
        } else {
            console.log("Could not find uid!");
        }
    }

    setField = (field, value) => {
        this.setState({
            form: {
                ...this.state.form,
                [field]: value
            }
        });
        if (!!this.state.errors[field]) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    [field]: null
                }
            });
        }
    }
    
    validate() {
        const errs = {};
        if (!this.state.form.first_name.trim()) {
            errs.first_name = "First name required."
        }
        if (!this.state.form.last_name.trim()) {
            errs.last_name = "Last name required."
        }
        return errs;
    }
    
    onSubmit() {
        const errs = this.validate();
        if (Object.keys(errs).length > 0) {
            this.setState({
                errors: errs
            });
        } else {
            this.persistData();
        }
    }

    render() {
        return (
            <div>
                <h5 style={{marginBottom: "20px"}}>Your Profile</h5>
                <Form.Group controlId="formChangeFirstName">
                    <Form.Control type="text" placeholder="First name" autoComplete="off" spellCheck="false" onChange={e => this.setField("first_name", e.target.value)} isInvalid={ !!this.state.errors.first_name }/>
                    <Form.Control.Feedback type="invalid">
                        { this.state.errors.first_name }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formChangeLastName">
                    <Form.Control type="text" placeholder="Last name" autoComplete="off" spellCheck="false" onChange={e => this.setField("last_name", e.target.value)} isInvalid={ !!this.state.errors.last_name }/>
                    <Form.Control.Feedback type="invalid">
                        { this.state.errors.last_name }
                    </Form.Control.Feedback>
                </Form.Group>
                {/* <p style={{marginTop: "40px"}}>Profile Picture</p>
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
                <input id="upload-pp" style={{marginTop: "15px", display: "none"}} name="newImage" type="file" onChange={this.handleNewImage} /> */}
                <p style={{fontSize: "17px", cursor: "pointer", width: "100px", position: "fixed", right: "0", bottom: "0", marginRight: "40px", marginBottom: "28px"}} onClick={this.onSubmit}>Update Profile</p>
            </div>
        )
    }
}