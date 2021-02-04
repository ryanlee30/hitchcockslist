import './App.css';
import { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import User from './components/User';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Route path={"/"}>
            <div className="left-panel">
              <h1 className="frontPageTitle">Hitchcock's List</h1>
            </div>
            <div className="right-panel">
              <Switch>
                  <Route path={"/signup"}>
                    <Signup />
                  </Route>
                  <Route path={"/login"}>
                    <Login />
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
              </Switch>
            </div>
          </Route>
        </BrowserRouter>
      </div>
    );
  }
}

function isLoggedIn() {
  return localStorage.getItem("@token");
}

export default App;
