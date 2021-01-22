import './App.css';
import { Component } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Button, Form } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
// import SignIn from './SignIn';
// import Register from "./Register";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Button variant="secondary">Register</Button>
          <br></br>
          <Form.Group controlId="formAuthEmail">
            <Form.Control type="email" placeholder="Email" />
          </Form.Group>
          <Form.Group controlId="formAuthPassword">
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group controlId="formAuthRemember">
            <Form.Check type="checkbox" label="Remember me" style={{fontSize: 15}}/>
          </Form.Group>
          <Button variant="primary">Sign In</Button>
          <Button variant="link">Forgot your password?</Button>
        </header>
      </div>
    );
  }
}

export default App;
