import '../App.css'
import { Component } from 'react';
import { Form, Alert } from 'react-bootstrap';
// import AvatarEditor from 'react-avatar-editor'
import { firebase } from '../firebase';

export default class ChangeProfile extends Component {
    constructor() {
        super();
        this.state = {
            onPasswordUpdate: "",
            errors: {},
            form: {first_name: "", last_name: ""},
        }
        this.setField = this.setField.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    persistData() {
        if (this.props.uid) {
            const db = firebase.firestore();
            db.collection('users').doc(this.props.uid).update({
                firstName: this.state.form.first_name,
                lastName: this.state.form.last_name,
            }).then(() => {
                if (this.props.history) {
                    if (this.props.history.location.pathname === "/review/v") {
                        let history = this.props.history;
                        setTimeout(() => {
                            history.push("/home");
                        }, 750);
                    } else {
                        setTimeout(() => {
                            window.location.reload();
                        }, 750);
                    }
                }
            });
            this.setState({
                onPasswordUpdate: "success"
            });
        } else {
            this.setState({
                onPasswordUpdate: "unknown"
            });
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
            this.setState({
                onPasswordUpdate: ""
            });
        }
        if (!this.state.form.last_name.trim()) {
            errs.last_name = "Last name required."
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
                <h5 style={{marginBottom: "20px"}}>Your Profile</h5>
                { this.state.onPasswordUpdate === "success" ?
                    <Alert variant="success">
                        Your name was successfully updated.
                    </Alert>
                    : null
                }
                { this.state.onPasswordUpdate === "unknown" ?
                    <Alert variant="danger">
                        Something went wrong. Please contact us.
                    </Alert>
                    : null
                }
                <p className="informative-text">Changing your name will refresh the page, so please submit your work first.</p>
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
                <p style={{fontSize: "17px", cursor: "pointer", width: "100px", position: "fixed", right: "0", bottom: "0", marginRight: "40px", marginBottom: "28px"}} onClick={this.onSubmit}>Update Profile</p>
            </div>
        )
    }
}