import React from "react";
import AppBar from '@material-ui/core/AppBar'
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
import outfitterLogo from '../../assets/outfitter-logo.png'

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
  
        <img style={{marginTop:'50px',marginBottom:'50px',width:'300px'}}src={outfitterLogo} alt='outfitter logo'/>

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
            style={{color:'#3a5e25',textDecoration:'none'}}
            onClick={() =>
              this.setState({ hasAccount: !this.state.hasAccount })
            }
          >
            {this.state.hasAccount?"Create new account":"I already have an account"}
          </Button>
        </div>
        <Button >
        <Link style={{color:'#3a5e25',textDecoration:'none'}} to="/child">Child login</Link>
          </Button>
        </Route>
        <Route path="/child">
          <ChildLogin/>
          <Button >
        <Link style={{color:'#3a5e25',textDecoration:'none'}} onClick={()=>this.setState({hasAccount:true})} to="/">Parent login</Link>
          </Button>

        </Route>
        
      </Switch>
    </Router>
      </div>
      
    );
  }
}
