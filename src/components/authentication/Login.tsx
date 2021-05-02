import React from "react";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { Weather } from "../../types";

import APIURL from "../../helpers/environment.js";

const styles = createStyles({
  root: {
    alignItems:'center',
    justifyContent:'center',
    color:'#3a5e25',

  },
  input: {
    width:'300px',
    marginTop:'10px',
  },
  paper: {
    margin:'auto',
    display: "flex",
    justifyContent: "center",
    width: "400px",
  },
  button: {
    marginTop:'10px',
    marginBottom:'10px',
    backgroundColor:'#96bb7c',
    color:'black',
    '&:hover': {
      backgroundColor: '#678b4f',
      color: '#black',
  },
  },
});

interface LoginProps extends WithStyles<typeof styles> {
  updateToken: (newToken: string) => void;
  setWeather: (weather: Weather) => void;
  setCity: (city: string) => void;
  classes: {
    root: string;
    input: string;
    paper: string;
    button: string;
  };
}

interface LoginState {
  password: string;
  email: string;
  showPassword: boolean;
  badEmail: boolean;
  badPassword: boolean;
  parentId: number | null;
  clicked: boolean;
}

class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      password: "",
      email: "",
      showPassword: false,
      badEmail: false,
      badPassword: false,
      parentId: null,
      clicked: false,
    };
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  findParent = async () => {
    this.setState({ clicked: true });
    const result = await fetch(`${APIURL}/parent/login`, {
      method: "POST",
      body: JSON.stringify({
        parent: {
          email: this.state.email,
          password: this.state.password,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    if (result.status === 200) {
      const { result: res, sessionToken: token } = await result.json();
      console.log(result);
      this.getWeather(res.lat, res.lon, token);
      this.props.setCity(res.city);
    } else if (result.status === 404) {
      this.setState({ badEmail: true });
    } else if (result.status === 401) {
      this.setState({ badPassword: true });
    }
  };
  getWeather = async (lat: number, lon: number, token: string) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.REACT_APP_WEATHER_API_KEY}
  `);
    const json = await result.json();
    this.props.setWeather(json);
    this.props.updateToken(token);
  };

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ clicked: true });
    this.findParent();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <div>
              <Typography variant='h4'>
                Login
              </Typography>
            </div>

            <div>
              <TextField
                className={classes.input}
                error={this.state.badEmail && this.state.clicked}
                helperText={
                  this.state.badEmail && this.state.clicked
                    ? "Account not found"
                    : ""
                }
                id="standard-basic"
                label="Email"
                onChange={(e) => this.setState({ email: e.target.value })}
              />
            </div>
            <div>
              <FormControl className={classes.input}>
                <InputLabel

                  error={this.state.badPassword && this.state.clicked}
                  htmlFor="standard-adornment-password"
                >
                  Password
                </InputLabel>
                <Input

                  error={this.state.badPassword && this.state.clicked}
                  id="standard-adornment-password"
                  type={this.state.showPassword ? "text" : "password"}
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={this.handleClickShowPassword}
                        onMouseDown={this.handleMouseDownPassword}
    
                      >
                        {this.state.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText
                  error={this.state.badPassword && this.state.clicked}
                >
                  {this.state.badPassword && this.state.clicked
                    ? "Incorrect password"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>

            <Button className={classes.button} type="submit" variant="contained">
              Submit
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
