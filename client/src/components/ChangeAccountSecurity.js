import '../App.css'
import { Component } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { auth } from '../firebase';

export default class ChangeAccountSecurity extends Component {
    constructor() {
        super();
        this.state = {
            onPasswordUpdate: "",
            errors: {},
            form: {new_password: "", confirm_new_password: ""},
        }
        this.setField = this.setField.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    persistData() {
        let user = auth.currentUser;
        user.updatePassword(this.state.form.new_password).then((msg) => {
            this.setState({
                onPasswordUpdate: "success",
                errors: {},
            });
        }).catch((error) => {
            if (error.code === "auth/requires-recent-login") {
                this.setState({
                    onPasswordUpdate: "login-again",
                    errors: {},
                });
            } else {
                this.setState({
                    onPasswordUpdate: "unknown",
                    errors: {},
                });
            }
        });
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
        if (!this.state.form.new_password.trim()) {
            errs.new_password = "Please provide a new password.";
            this.setState({
                onPasswordUpdate: ""
            });
        }
        if (!this.state.form.confirm_new_password.trim()) {
            errs.confirm_new_password = "Please confirm your new password.";
            this.setState({
                onPasswordUpdate: ""
            });
        }
        if (this.state.form.new_password.trim().length < 6) {
            errs.new_password = "New password must contain 6 or more characters.";
        }
        if (this.state.form.new_password !== this.state.form.confirm_new_password) {
            errs.new_password = "Passwords didn't match. Please try again.";
            this.setState({
                onPasswordUpdate: ""
            });
        }
        if (!this.state.form.new_password.trim() && this.state.form.confirm_new_password.trim()) {
            errs.new_password = "Please provide a new password.";
            this.setState({
                onPasswordUpdate: ""
            });
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
                <h5 style={{marginBottom: "20px"}}>Change Password</h5>
                { this.state.onPasswordUpdate === "success" ?
                    <Alert variant="success">
                        Password successfully updated.
                    </Alert>
                    : null
                }
                { this.state.onPasswordUpdate === "login-again" ?
                    <Alert variant="warning">
                        Please try after logging in again.
                    </Alert>
                    : null
                }
                { this.state.onPasswordUpdate === "unknown" ?
                    <Alert variant="danger">
                        Something went wrong. Please contact us.
                    </Alert>
                    : null
                }
                <p className="informative-text">A password change requires a recent log in.</p>
                <Form.Group controlId="formChangeNewPassword">
                    <Form.Control type="password" placeholder="New password" autoComplete="off" spellCheck="false" onChange={e => this.setField("new_password", e.target.value)} isInvalid={ !!this.state.errors.new_password }/>
                    <Form.Control.Feedback type="invalid">
                        { this.state.errors.new_password }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formChangeConfirmNewPassword">
                    <Form.Control type="password" placeholder="Confirm new password" autoComplete="off" spellCheck="false" onChange={e => this.setField("confirm_new_password", e.target.value)} isInvalid={ !!this.state.errors.confirm_new_password }/>
                    <Form.Control.Feedback type="invalid">
                        { this.state.errors.confirm_new_password }
                    </Form.Control.Feedback>
                </Form.Group>
                <p style={{fontSize: "17px", cursor: "pointer", width: "100px", position: "fixed", right: "0", bottom: "0", marginRight: "40px", marginBottom: "28px"}} onClick={this.onSubmit}>Update Profile</p>
            </div>
        )
    }
}