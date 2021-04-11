import '../App.css';
import { React, useState, useLayoutEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { auth, firebase } from '../firebase';
import { Form, Alert } from 'react-bootstrap'
import GoogleButton from 'react-google-button';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  useLayoutEffect(() => {
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
    firebase.auth().signInWithEmailAndPassword({email}.email, {password}.password)
      .then(() => {
        firebase.auth().currentUser.getIdToken(true).then((idToken) => {
          if (idToken) {
            localStorage.setItem("@token", idToken);
            history.push("/home");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onEnter(event) {
    if (event.key === "Enter") {
      passwordAuthentication();
    }
  }

  return (
      <div style={{paddingBottom: 150}}>
        <Link to="/signup" className="redirect-btn" style={{textDecoration: 'none', float: 'right'}}>Sign up</Link>
        <br></br>
        <div style={{paddingTop: 100, paddingBottom: 50}}>
          <GoogleButton onClick={googleAuthentication} />
        </div>
        <Form.Group controlId="formAuthEmail">
          <Form.Control type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
        </Form.Group>
        <Form.Group controlId="formAuthPassword">
          <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} onKeyPress={e => onEnter(e)}/>
        </Form.Group>
        <Link to="#" className="redirect-btn" style={{textDecoration: 'none'}} onClick={passwordAuthentication}>Log in</Link>
        <div style={{paddingTop: 15}}>
          <Link to="#" className="forgot-pwd-btn" style={{textDecoration: 'none'}}>Forgot your password?</Link>
        </div>
      </div>
  );
}
