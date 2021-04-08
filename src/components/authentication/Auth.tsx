import React from "react";
import Button from "@material-ui/core/Button"
import Login from "./Login";
import Signup from "./Signup";

interface AuthProps {
  sessionToken: string;
  clearToken: () => void;
  updateToken: (newToken: string) => void;
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
          />
        ) : (
          <Signup
          updateToken={this.props.updateToken}
        />
        )}
        <Button variant="contained" color = "primary"
          onClick={() => this.setState({ hasAccount: !this.state.hasAccount })}
        >
          Click
        </Button>
      </div>
    );
  }
}
