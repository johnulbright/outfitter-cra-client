import React from "react";
import Paper from "@material-ui/core/Paper";

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
import Typography from "@material-ui/core/Typography";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";

import APIURL from "../../helpers/environment.js";
import { Weather } from "../../types";

const styles = createStyles({
  root: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "300px",
    marginTop: "10px",
  },
  paper: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    width: "400px",
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

interface SignupProps extends WithStyles<typeof styles> {
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
interface SignupState {
  password: string;
  zipCode: string;
  email: string;
  showPassword: boolean;
  badFirstName: boolean;
  badLastName: boolean;
  badZip: boolean;
  badEmail: boolean;
  takenEmail: boolean;
  badPassword: boolean;
  lat: number | null;
  lon: number | null;
  firstName: string;
  lastName: string;
  timeZone: number | null;
  city: string | null;
  parentId: number | null;
  clicked: boolean;
}

class Signup extends React.Component<SignupProps, SignupState> {
  constructor(props: SignupProps) {
    super(props);
    this.state = {
      password: "",
      zipCode: "",
      email: "",
      showPassword: false,
      badFirstName: true,
      badLastName: true,
      badZip: true,
      badEmail: true,
      takenEmail: false,
      badPassword: true,
      lat: null,
      lon: null,
      firstName: "",
      lastName: "",
      timeZone: null,
      city: "",
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

  getLatLong = () => {
    fetch(
      `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=&refine.zip=${this.state.zipCode}`
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("nhits", json.nhits);
        if (json.nhits === 1) {
          this.setState(
            {
              lat: json.records[0].fields.latitude,
              lon: json.records[0].fields.longitude,
              timeZone: json.records[0].fields.timezone,
              city: json.records[0].fields.city,
            },
            () => this.createParent()
          );
        } else {
          this.setState({badZip:true})
        }
      });
  }

  createParent = async () => {
    console.log('got here')
    const result = await fetch(`${APIURL}/parent/signup`, {
      method: "POST",
      body: JSON.stringify({
        parent: {
          email: this.state.email,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          zipCode: this.state.zipCode,
          lat: this.state.lat,
          lon: this.state.lon,
          timeZone: this.state.timeZone,
          city: this.state.city,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    const { result: res, sessionToken: token,error:err } = await result.json();
    console.log("parent res", res);
    console.log("parent error", err);
    if (err){
      if (err.name==="SequelizeUniqueConstraintError"){
        this.setState({takenEmail:true})
      }
    } else{
      this.props.setCity(res.city);
      this.getWeather(res.lat, res.lon, token);
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
    let ready =
      !this.state.badFirstName &&
      !this.state.badLastName &&
      !this.state.badZip &&
      !this.state.badEmail &&
      !this.state.badPassword;
    if (ready) {
      this.getLatLong();
    }
  };
  emailHelperText=()=>{
    if(this.state.clicked){
      if(this.state.badEmail){
        return 'Must be a valid email'
      } else if (this.state.takenEmail){
        return 'This email already has an account'
      } else {
        return ''
      }
    } else {
      return ''
    }
  }
  validateEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <div>
              <Typography variant="h4">Signup</Typography>
            </div>
            <div>
              <TextField
                className={classes.input}
                error={this.state.badFirstName && this.state.clicked}
                helperText={
                  this.state.badFirstName && this.state.clicked
                    ? "Required"
                    : ""
                }
                label="First Name"
                defaultValue=""
                onChange={(e) =>
                  this.setState({
                    firstName: e.target.value,
                    badFirstName: e.target.value.length === 0,
                  })
                }
              />
            </div>
            <div>
              <TextField
                className={classes.input}
                error={this.state.badLastName && this.state.clicked}
                helperText={
                  this.state.badLastName && this.state.clicked ? "Required" : ""
                }
                label="Last name"
                defaultValue=""
                onChange={(e) =>
                  this.setState({
                    lastName: e.target.value,
                    badLastName: e.target.value.length === 0,
                  })
                }
              />
            </div>
            <div>
              <TextField
                className={classes.input}
                error={this.state.badZip && this.state.clicked}
                helperText={
                  this.state.badZip && this.state.clicked
                    ? "Enter a valid 5 digit zip code"
                    : ""
                }
                label="Zip Code"
                defaultValue=""
                onChange={(e) =>
                  this.setState({
                    zipCode: e.target.value,
                    badZip:
                      e.target.value.length !== 5 ||
                      isNaN(Number(this.state.zipCode)),
                  })
                }
              />
            </div>
            <div>
              <TextField
                className={classes.input}
                error={(this.state.badEmail||this.state.takenEmail) && this.state.clicked}
                helperText={this.emailHelperText()}
                id="standard-basic"
                label="Email"
                onChange={(e) =>
                  this.setState({
                    email: e.target.value,
                    badEmail: !this.validateEmail(e.target.value),
                  })
                }
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
                  onChange={(e) =>
                    this.setState({
                      password: e.target.value,
                      badPassword: e.target.value.length < 5,
                    })
                  }
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
                    ? "Minimum 5 characters"
                    : ""}
                </FormHelperText>
              </FormControl>
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
    );
  }
}
export default withStyles(styles)(Signup);
