import React from "react";
import Button from "@material-ui/core/Button"
import Login from "./Login";
import Signup from "./Signup";

interface AuthProps {
  updateToken: (newToken: string) => void;
  setLatLon:(latutide:number|null,longitude:number|null)=>void;
  setWeather:(weather:object)=>void;
}

interface AuthState {
  hasAccount: boolean;
}


export default class Auth extends React.Component<AuthProps, AuthState> {
  constructor(props: AuthProps) {
    super(props);
    this.state = {
      hasAccount: false,
    };
  }

  render() {
    return (
      <div>
        {this.state.hasAccount ? (
          <Login
            updateToken={this.props.updateToken}
            setLatLon={this.props.setLatLon}
            setWeather={this.props.setWeather}


          />
        ) : (
          <Signup
          updateToken={this.props.updateToken}
          setLatLon={this.props.setLatLon}
          setWeather={this.props.setWeather}
        />
        )}
        <Button variant="contained" color = "primary"
          onClick={() => this.setState({ hasAccount: !this.state.hasAccount })}
        >
          toggle
        </Button>
      </div>
    );
  }
}
