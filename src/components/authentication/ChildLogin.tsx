import React from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { Weather, ChildKeys } from "../../types";
import ChildOutfit from "../children/ChildOutfit";
import Paper from "@material-ui/core/Paper";

import APIURL from "../../helpers/environment.js";

const styles = createStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    margin: "0px",
  },
  input: {
    width: "300px",
    marginTop: "10px",
    color: "pink",
    "&:focused": {
      boxShadow: "none",
      backgroundColor: "#3c52b2",
    },
  },
  paper: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    width: "400px",
    backgroundColor: "#F5F5F6",
  },
  button: {
    marginTop: "10px",
    marginBottom: "10px",
    backgroundColor: "#96bb7c",
    color: "black",
    "&:hover": {
      backgroundColor: "#678b4f",
      color: "#black",
    },
  },
});

interface ChildLoginProps extends WithStyles<typeof styles> {
  classes: {
    root: string;
    input: string;
    paper: string;
    button: string;
  };
}

interface ChildLoginState {
  child: ChildKeys;
  username: string;
  badUsername: boolean;
  clicked: boolean;
  loggedIn: boolean;
  weather: Weather;
}

class ChildLogin extends React.Component<ChildLoginProps, ChildLoginState> {
  constructor(props: ChildLoginProps) {
    super(props);
    this.state = {
      child: {
        id: null,
        name: null,
        username: null,
        parentId: null,
        underwearRemind: false,
      },
      username: "",
      badUsername: false,
      clicked: false,
      loggedIn: false,
      weather: {
        current: {
          temp: 999,
          weather: [
            {
              description: "",
              icon: "",
            },
          ],
        },
        hourly: [],
        daily: [],
      },
    };
  }

  findChild = async () => {
    this.setState({ clicked: true });
    const result = await fetch(`${APIURL}/child/login/${this.state.username}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    if (result.status === 200) {
      const json = await result.json();
      this.setState({ child: json });
      this.findParent(json.parentId);
    } else if (result.status === 403) {
      this.setState({ badUsername: true });
    }
  };
  findParent = async (id: number) => {
    const result = await fetch(`${APIURL}/parent/${id}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    if (result.status === 200) {
      const json = await result.json();
      this.getWeather(json.lat, json.lon);
    }
  };

  getWeather = async (lat: number, lon: number) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=c2845afc3766e0d9e612589838737941`);
    const json = await result.json();
    this.setState({ weather: json, loggedIn: true });
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ clicked: true });
    this.findChild();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.state.loggedIn ? (
          <ChildOutfit weather={this.state.weather} child={this.state.child} />
        ) : (
          <div className={classes.root}>
            <Paper className={classes.paper}>
              <form autoComplete="off" onSubmit={this.handleSubmit}>
                <div>
                  <Typography variant="h4">Child Login</Typography>
                </div>
                <div>
                  <TextField
                    className={classes.input}
                    error={this.state.badUsername && this.state.clicked}
                    helperText={
                      this.state.badUsername && this.state.clicked
                        ? "Username not found.  Check with your parent."
                        : ""
                    }
                    id="standard-basic"
                    label="Username"
                    onChange={(e) =>
                      this.setState({ username: e.target.value })
                    }
                  />
                </div>

                <Button
                  className={classes.button}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </form>
            </Paper>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ChildLogin);
