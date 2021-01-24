import './App.css';
import { Component } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from './controllers/Login';
import Signup from "./controllers/Signup";
import Home from "./controllers/Home";
import User from "./controllers/User";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="left-panel">
          <h1 className="frontPageTitle">Hitchcock's List</h1>
        </div>
        <div className="right-panel">
          <BrowserRouter>
          <Switch>
              <Route path={"/login"}>
                <Login />
              </Route>
              <Route path={"/signup"}>
                <Signup />
              </Route>
              <Route path={"/home"}>
                <Home />
              </Route>
              <Route path={"/user"}>
                <User />
              </Route>
          </Switch>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;
