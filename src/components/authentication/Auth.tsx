import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  Redirect,
} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Login from "./Login";
import Signup from "./Signup";
import ChildLogin from "./ChildLogin";
import { Weather } from "../../types";

interface AuthProps {
  updateToken: (newToken: string) => void;
  setWeather: (weather: Weather) => void;
  setCity: (city: string) => void;
}

interface AuthState {
  hasAccount: boolean;
}

export default class Auth extends React.Component<AuthProps, AuthState> {
  constructor(props: AuthProps) {
    super(props);
    this.state = {
      hasAccount: true,
    };
  }

  render() {
    return (
      <div>
<Router>
      <Switch>
        <Route exact path="/">
        <div>
          {this.state.hasAccount ? (
            <Login
              updateToken={this.props.updateToken}
              setWeather={this.props.setWeather}
              setCity={this.props.setCity}
            />
          ) : (
            <Signup
              updateToken={this.props.updateToken}
              setWeather={this.props.setWeather}
              setCity={this.props.setCity}
            />
          )}
          <Button
            color="primary"
            onClick={() =>
              this.setState({ hasAccount: !this.state.hasAccount })
            }
          >
            {this.state.hasAccount?"Create new account":"I already have an account"}
          </Button>
        </div>
        <Link to="/child">Child login</Link>
        </Route>
        <Route path="/child">
          <ChildLogin/>
        <Link to="/">Parent login</Link>

        </Route>
        
      </Switch>
    </Router>
      </div>
      
    );
  }
}
