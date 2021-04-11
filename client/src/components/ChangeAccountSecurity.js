import '../App.css'
import { Component } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { firebase, auth } from '../firebase';

export default class ChangeAccountSecurity extends Component {
    constructor() {
        super();
        this.state = {
            onPasswordUpdate: "",
            errors: {},
            form: {current_password: "", new_password: "", confirm_password: ""},
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
    }

    persistData() {
        let user = auth.currentUser;
        user.updatePassword(this.state.form.new_password).then(() => {
            this.setState({
                onPasswordUpdate: "success"
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                onPasswordUpdate: "unknown"
            });
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
        if (!this.state.form.current_password.trim()) {
            errs.current_password = "Please provide your current password."
        }
        if (!this.state.form.new_password.trim()) {
            errs.new_password = "Please provide a new password."
        }
        if (!this.state.form.confirm_password.trim()) {
            errs.confirm_password = "Please confirm the new password."
        }
        if (this.state.form.new_password !== this.state.form.confirm_password) {
            this.setState({
                onPasswordUpdate: "failed"
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
                { this.state.onPasswordUpdate === "failed" ?
                    <Alert variant="danger">
                        Password confirmation does not match.
                    </Alert>
                    : null
                }
                { this.state.onPasswordUpdate === "unknown" ?
                    <Alert variant="danger">
                        Something went wrong. Please contact us.
                    </Alert>
                    : null
                }
                <Form.Group controlId="formChangeOldPassword">
                    <Form.Control type="text" placeholder="Current password" autoComplete="off" onChange={e => this.setField("current_password", e.target.value)} isInvalid={ !!this.state.errors.current_password }/>
                    <Form.Control.Feedback type="invalid">
                        { this.state.errors.current_password }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formChangeNewPassword">
                    <Form.Control type="text" placeholder="New password" autoComplete="off" onChange={e => this.setField("new_password", e.target.value)} isInvalid={ !!this.state.errors.new_password }/>
                    <Form.Control.Feedback type="invalid">
                        { this.state.errors.new_password }
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formChangeConfirmNewPassword">
                    <Form.Control type="text" placeholder="Confirm new password" autoComplete="off" onChange={e => this.setField("confirm_password", e.target.value)} isInvalid={ !!this.state.errors.confirm_password }/>
                    <Form.Control.Feedback type="invalid">
                        { this.state.errors.confirm_password }
                    </Form.Control.Feedback>
                </Form.Group>
                <p style={{fontSize: "17px", cursor: "pointer", width: "100px", position: "fixed", right: "0", bottom: "0", marginRight: "40px", marginBottom: "28px"}} onClick={this.onSubmit}>Update Profile</p>
            </div>
        )
    }
}