import '../App.css';
import { React, useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { auth, firebase } from '../firebase';
import { Form, Alert } from 'react-bootstrap'
import GoogleButton from 'react-google-button';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as EmailValidator from 'email-validator';

export default function Login() {
  const [form, setForm] = useState({email: "", password: ""});
  const [errors, setErrors] = useState({});

  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("@token")) {
      history.replace("/home");
    }
  }, [history]);

  async function googleAuthentication() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider).then(
      async () => {
        const token = await auth?.currentUser?.getIdToken(true);
        if (token) {
          localStorage.setItem("@token", token);
        }
      },
      function (error) {
        console.log(error);
      }
    ).then(() => {
      history.push("/home");
    });
  }

  function passwordAuthentication() {
    firebase.auth().signInWithEmailAndPassword(form.email, form.password)
      .then(() => {
        firebase.auth().currentUser.getIdToken(true).then((idToken) => {
          if (idToken) {
            localStorage.setItem("@token", idToken);
            history.push("/home");
          }
        });
      })
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          setErrors({
            ...errors,
            email: "Please enter a valid email address."
          })
        } else if (error.code === "auth/user-not-found") {
          setErrors({
            ...errors,
            email: "This email has not been signed up."
          })
        } else if (error.code === "auth/wrong-password") {
          setErrors({
            ...errors,
            password: "Wrong password. Please try again."
          })
        }
        console.log(error);
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
      if (!form.password.trim()) {
        errs.password = "Please provide your password.";
      }
      return errs;
  }

  function onSubmit() {
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
      } else {
          passwordAuthentication();
      }
  }

  return (
      <div>
        <Link to="/signup" className="redirect-btn" style={{textDecoration: 'none', float: 'right'}}>Sign up</Link>
        <br></br>
        <div style={{paddingTop: 100, paddingBottom: 50}}>
          <GoogleButton type="light" label="Log in with Google" onClick={googleAuthentication} style={{borderRadius: "5px"}}/>
        </div>
        <Form.Group controlId="formAuthEmail">
          <Form.Control type="email" placeholder="Email" spellCheck="false" onChange={e => setField("email", e.target.value)} isInvalid={ !!errors.email }/>
          <Form.Control.Feedback type="invalid" className="field-error">
            { errors.email }
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="formAuthPassword">
          <Form.Control type="password" placeholder="Password" spellCheck="false" onChange={e => setField("password", e.target.value)} onKeyPress={e => onEnter(e)} isInvalid={ !!errors.password }/>
          <Form.Control.Feedback type="invalid" className="field-error">
            { errors.password }
          </Form.Control.Feedback>
        </Form.Group>
        <Link to="#" className="redirect-btn" style={{textDecoration: 'none'}} onClick={onSubmit}>Log in</Link>
        <div>
          <Link to="/forgot-password" className="forgot-pwd-btn" style={{textDecoration: 'none'}}>Forgot your password?</Link>
        </div>
      </div>
  );
}
