import '../App.css';
import { React, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { firebase } from "../firebase";
import { Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  function createUser() {
    firebase.auth().createUserWithEmailAndPassword({email}.email, {password}.password)
        .then((userCredential) => {
            const user = userCredential.user;
            addUser(user.uid);
            history.push('/login');
        })
        .catch((error) => {
            console.log(error);
        });
  }

  function redirectToLogin() {
    history.push("/login")
  }

  function addUser(uid) {
    const db = firebase.firestore();
    db.collection('users').add({
      firstName: {firstName}.firstName,
      lastName: {lastName}.lastName,
      uid: uid,
      created: firebase.firestore.Timestamp.now()
    });
  };
  
  return (
      <div style={{paddingBottom: 150}}>
        <div style={{paddingBottom: 100}}>
            <Link className="redirect-btn" style={{textDecoration: 'none', float: 'right'}} onClick={redirectToLogin}>Log in</Link>
        </div>
        <br></br>
        <Form.Group controlId="formSignUpFirstName">
          <Form.Control type="text" placeholder="First name" onChange={e => setFirstName(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="formSignUpLastName">
          <Form.Control type="text" placeholder="Last name" onChange={e => setLastName(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="formSignUpEmail">
          <Form.Control type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="formSignUpPassword">
          <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
        </Form.Group>
        <Link className="redirect-btn" style={{textDecoration: 'none'}} onClick={createUser}>Sign up</Link>
      </div>
  );
}
