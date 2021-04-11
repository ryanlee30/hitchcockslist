import '../App.css'
import { Component } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { firebase } from '../firebase';

export default class ChangeAccountSecurity extends Component {
    constructor() {
        super();
        this.state = {
            oldPassword: "",
            password: "",
            confirmPassword: "",
        }
    }

    persistData() {
        if (this.props.uid) {
            const db = firebase.firestore();
            db.collection('users').doc(this.props.uid).update({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                // profilePicture: this.handleSave()
            });
        } else {
            console.log("Could not find uid!");
        }
    }

    render() {
        return (
            <div>
                <h5 style={{marginBottom: "20px"}}>Change Password</h5>
                <Form.Group controlId="formChangeOldPassword">
                  <Form.Control type="text" placeholder="Old password" autoComplete="off" onChange={e => this.setState({ oldPassword: e.target.value })}/>
                </Form.Group>
                <Form.Group controlId="formChangeNewPassword">
                  <Form.Control type="text" placeholder="New password" autoComplete="off" onChange={e => this.setState({ newPassword: e.target.value })}/>
                </Form.Group>
                <Form.Group controlId="formChangeConfirmNewPassword">
                  <Form.Control type="text" placeholder="Confirm new password" autoComplete="off" onChange={e => this.setState({ confirmNewPassword: e.target.value })}/>
                </Form.Group>
                <p style={{fontSize: "17px", cursor: "pointer", width: "100px", float: "right", marginTop: "15px"}} onClick={this.persistData}>Update Profile</p>
            </div>
        )
    }
}