import React from "react";
import Button from "@material-ui/core/Button"
import Login from "./Login";
import Signup from "./Signup";

interface AuthProps {
  updateToken: (newToken: string) => void;
  setWeather:(weather:object)=>void;
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
      <div >
        {this.state.hasAccount ? (
          <Login
            updateToken={this.props.updateToken}
            setWeather={this.props.setWeather}


          />
        ) : (
          <Signup
          updateToken={this.props.updateToken}
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

