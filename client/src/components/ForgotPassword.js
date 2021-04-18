import '../App.css';
import { React, useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { Form, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as EmailValidator from 'email-validator';

export default function ForgotPassword() {
  const [form, setForm] = useState({email: ""});
  const [errors, setErrors] = useState({});
  const [onPasswordReset, setOnPasswordReset] = useState("");

  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("@token")) {
      history.replace("/home");
    }
  }, [history]);

  function sendPasswordResetEmail() {
    auth.sendPasswordResetEmail(form.email).then(function() {
      setOnPasswordReset("success");
    }).catch(function(error) {
      if (error.code === "auth/user-not-found") {
        setOnPasswordReset("user-not-found");
      } else {
        setOnPasswordReset("unknown");
      }
    });
  }
  
  function onEnter(event) {
    if (event.key === "Enter") {
      onSubmit();
    }
  }

  const setField = (field, value) => {
    setForm({
        ...form,
        [field]: value
    });
    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  }

  function validate() {
      const errs = {};
      if (!EmailValidator.validate(form.email)) {
        errs.email = "Please provide a valid email address.";
      }
      if (!form.email.trim()) {
        errs.email = "Please provide an email address.";
      }
      return errs;
  }

  function onSubmit() {
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
      } else {
        sendPasswordResetEmail();
      }
  }
  
  return (
      <div style={{paddingBottom: 150}}>
        { onPasswordReset === "success" ?
        <div>
          <Alert variant="success" style={{width: "250px", fontSize: "16px"}}>Password reset email has been sent!</Alert>
          <br></br>
        </div>
        : null}
        { onPasswordReset === "user-not-found" ?
        <div>
          <Alert variant="warning" style={{width: "250px", fontSize: "16px"}}>This email is not signed up.</Alert>
          <br></br>
        </div>
        : null}
        { onPasswordReset === "unknown" ?
        <div>
          <Alert variant="danger" style={{width: "250px", fontSize: "16px"}}>Something went wrong. Please contact us.</Alert>
          <br></br>
        </div>
        : null}
      <div style={{paddingBottom: 100}}>
          <Link to="/login" className="redirect-btn" style={{textDecoration: 'none', float: 'right'}}>Log in</Link>
      </div>
      <br></br>
      <Form.Group controlId="formSignUpEmail">
        <p style={{fontFamily: "Calibri", fontSize: "16px", textAlign: "left"}}>Send a password reset email</p>
        <Form.Control type="email" placeholder="Email" onChange={e => setField("email", e.target.value)} onKeyPress={e => onEnter(e)}  isInvalid={ !!errors.email }/>
        <Form.Control.Feedback type="invalid" className="field-error">
          { errors.email }
        </Form.Control.Feedback>
      </Form.Group>
      <br></br>
      <Link to="#" className="redirect-btn" style={{textDecoration: 'none'}} onClick={onSubmit}>Reset</Link>
      </div>
  );
}
