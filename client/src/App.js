import './App.css';
import { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Unprotected from './components/Unprotected';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import ForgotPassword from './components/ForgotPassword';
import NewReview from './components/NewReview';
import ViewReview from './components/ViewReview';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path={"/"}>
              <Redirect to="/home"/>
            </Route>
            <Route path={"/signup"}>
              <Unprotected children={<Signup />}/>
            </Route>
            <Route path={"/login"}>
              <Unprotected children={<Login />}/>
            </Route>
            <Route path={"/forgot-password"}>
              <Unprotected children={<ForgotPassword />}/>
            </Route>
            <Route path={"/home"} render={() => (
              isLoggedIn() ? (
                <Home />
              ) : (
                <Redirect to="/login"/>
              )
            )}/>
            <Route exact path={"/review"}>
              <Redirect to="/review/n"/>
            </Route>
            <Route path={"/review/n"} render={() => (
              isLoggedIn() ? (
                <NewReview />
              ) : (
                <Redirect to="/login"/>
              )
            )}/>
            <Route path={"/review/v"} render={() => (
              isLoggedIn() ? (
                <ViewReview />
              ) : (
                <Redirect to="/login"/>
              )
            )}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

function isLoggedIn() {
  return localStorage.getItem("@token");
}
