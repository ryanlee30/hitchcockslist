import './App.css';
import { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Unprotected from './components/Unprotected';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import User from './components/User';
import NewReview from './components/NewReview';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
              <Switch>
                  <Route path={"/signup"}>
                    <Unprotected children={<Signup />}/>
                  </Route>
                  <Route path={"/login"}>
                    <Unprotected children={<Login />}/>
                  </Route>
                  <Route path={"/home"} render={() => (
                    isLoggedIn() ? (
                      <Home />
                    ) : (
                      <Redirect to="/login"/>
                    )
                  )}/>
                  <Route path={"/user"} render={() => (
                    isLoggedIn() ? (
                      <User />
                    ) : (
                      <Redirect to="/login"/>
                    )
                  )}/>
                  <Route exact path={"/review"}>
                    <Redirect to="/review/n"/>
                  </Route>
                  <Route path={"/review/n"}>
                    <NewReview />
                  </Route>
              </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

function isLoggedIn() {
  return localStorage.getItem("@token");
}
