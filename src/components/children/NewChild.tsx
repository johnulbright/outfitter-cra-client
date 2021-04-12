import React from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";

import APIURL from "../../helpers/environment.js";

interface NewChildProps {
  sessionToken: string;
  getMyChildren: () => void;
  takenUsernames: string[];
}

interface NewChildState {
  name: string;
  username: string;
  deviceId: string;
  underwearRemind: boolean;
  badName: boolean;
  badUsername: boolean;
  clicked: boolean;
  allUsernames: string[];
}

export default class NewChild extends React.Component<
  NewChildProps,
  NewChildState
> {
  constructor(props: NewChildProps) {
    super(props);
    this.state = {
      name: "",
      username: "",
      deviceId: "",
      underwearRemind: false,
      badName: true,
      badUsername: true,
      clicked: false,
      allUsernames: this.props.takenUsernames,
    };
    this.createChild = this.createChild.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goodUsername = this.goodUsername.bind(this);
  }

  createChild = async (): Promise<void> => {
    const result = await fetch(`${APIURL}/child/create`, {
      method: "POST",
      body: JSON.stringify({
        child: {
          name: this.state.name,
          username: this.state.username,
          underwearRemind: this.state.underwearRemind,
          deviceId: this.state.deviceId,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    const res = await result.json();
    console.log(res);
    this.props.getMyChildren();
    this.setState({
      allUsernames: [...this.state.allUsernames, this.state.username],
    });
    this.setState({
      name: "",
      username: "",
      underwearRemind: false,
      clicked: false,
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ clicked: true });
    let ready = !this.state.badName && !this.state.badUsername;
    if (ready) {
      this.createChild();

      this.setState({
        allUsernames: [...this.state.allUsernames, this.state.username],
      });
      this.setState({
        name: "",
        username: "",
        underwearRemind: false,
        clicked: false,
      });
    }
  };

  goodUsername(text: string): boolean {
    let unique = true;
    this.props.takenUsernames?.map((i: string): void => {
      if (i === text) {
        unique = false;
      }
    });
    return unique;
  }
  handleNameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log(e.target.value);
    if (e.target.value.length > 0) {
      this.setState({
        name: e.target.value,
        badName: e.target.value.length === 0,
      });
    }
  }
  handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>): void {
    //   this.setState({
    //     username: e.target.value,
    //     badUsername: !this.goodUsername(e.target.value),
    //   })
  }
  render(): JSX.Element {
    return (
      <div>
        <h1>New child</h1>
        <form autoComplete="off">
          <TextField
            value={this.state.name}
            error={this.state.badName && this.state.clicked}
            helperText={
              this.state.badName && this.state.clicked ? "Required" : ""
            }
            label="Name"
            onChange={this.handleNameChange}
          />
          <TextField
            value={this.state.username}
            error={this.state.badUsername && this.state.clicked}
            helperText={
              this.state.badUsername && this.state.clicked
                ? "Username is taken"
                : ""
            }
            label="User name"
            defaultValue=""
            // onChange={this.handleUsernameChange}
          />
          <Checkbox
            checked={this.state.underwearRemind}
            color="primary"
            inputProps={{ "aria-label": "secondary checkbox" }}
            onChange={(event) =>
              this.setState({ underwearRemind: event.target.checked })
            }
          />
          <Button
            onClick={(e) => this.handleSubmit(e)}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
}
