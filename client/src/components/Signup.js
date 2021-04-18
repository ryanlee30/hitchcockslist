import '../App.css';
import { React, useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { firebase } from '../firebase';
import { Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as EmailValidator from 'email-validator';

export default function Signup() {
  const [form, setForm] = useState({firstName: "", lastName: "", email: "", password: ""});
  const [errors, setErrors] = useState({});

  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem("@token")) {
      history.replace("/home", { modalShow: true })
    }
  }, [history]);

  function createUser() {
    firebase.auth().createUserWithEmailAndPassword(form.email, form.password)
        .then((userCredential) => {
            const user = userCredential.user;
            addUser(user.uid, user.email);
            history.push('/login');
        })
        .catch((error) => {
            console.log(error);
        });
  }

  function addUser(uid, email) {
    const db = firebase.firestore();
    db.collection('users').doc(uid).set({
      firstName: form.firstName,
      lastName: form.lastName,
      email: email,
      profilePicture: "",
      uid: uid,
      created: firebase.firestore.Timestamp.now()
    });
  };
  
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
      if (!form.firstName.trim()) {
        errs.firstName = "Please provide your first name.";
      }
      if (!form.lastName.trim()) {
        errs.lastName = "Please provide your last name.";
      }
      if (!form.email.trim()) {
        errs.email = "Please provide an email address.";
      }
      if (form.password.trim().length < 6) {
        errs.password = "Password must be 6 or more characters.";
      }
      if (!form.password.trim()) {
        errs.password = "Please provide a password.";
      }
      return errs;
  }

  function onSubmit() {
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
      } else {
        createUser();
      }
  }
  
  return (
      <div style={{paddingBottom: 150}}>
      <div style={{paddingBottom: 100}}>
          <Link to="/login" className="redirect-btn" style={{textDecoration: 'none', float: 'right'}}>Log in</Link>
      </div>
      <br></br>
      <Form.Group controlId="formSignUpFirstName">
        <Form.Control type="text" placeholder="First name" onChange={e => setField("firstName", e.target.value)} isInvalid={ !!errors.firstName }/>
        <Form.Control.Feedback type="invalid" className="field-error">
          { errors.firstName }
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formSignUpLastName">
        <Form.Control type="text" placeholder="Last name" onChange={e => setField("lastName", e.target.value)} isInvalid={ !!errors.lastName }/>
        <Form.Control.Feedback type="invalid" className="field-error">
          { errors.lastName }
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formSignUpEmail">
        <Form.Control type="email" placeholder="Email" onChange={e => setField("email", e.target.value)} isInvalid={ !!errors.email }/>
        <Form.Control.Feedback type="invalid" className="field-error">
          { errors.email }
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formSignUpPassword">
        <Form.Control type="password" placeholder="Password" onChange={e => setField("password", e.target.value)} onKeyPress={e => onEnter(e)} isInvalid={ !!errors.password }/>
        <Form.Control.Feedback type="invalid" className="field-error">
          { errors.password }
        </Form.Control.Feedback>
      </Form.Group>
      <Link to="#" className="redirect-btn" style={{textDecoration: 'none'}} onClick={onSubmit}>Sign up</Link>
      </div>
  );
}
