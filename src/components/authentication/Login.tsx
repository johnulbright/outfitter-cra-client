import React from "react";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from "@material-ui/core/Button"
import { createStyles,WithStyles,withStyles } from '@material-ui/styles';



import APIURL from '../../helpers/environment.js'

const styles = createStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
  paper:{},
  button:{}
})

interface LoginProps extends WithStyles<typeof styles> {
  updateToken: (newToken: string) => void;
  setWeather: (weather: object) => void;
  classes:{
    root:string;
    paper:string;
    button:string
  };
}

interface LoginState {
  password: string;
  email: string;
  showPassword: boolean;
  badEmail: boolean;
  badPassword: boolean;
  parentId: number | null;
  clicked: boolean

}



class Login extends React.Component<LoginProps, LoginState>{

  constructor(props: LoginProps) {
    super(props)
    this.state = {
      password: '',
      email: '',
      showPassword: false,
      badEmail: false,
      badPassword: false,
      parentId: null,
      clicked: false
    }
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };



  findParent = async () => {
    const result = await fetch(`${APIURL}/parent/login`, {
      method: 'POST',
      body: JSON.stringify({
        parent: {
          email: this.state.email,
          password: this.state.password,
        }
      }),
      headers: new Headers({
        'Content-Type': "application/json"
      })
    });
    const {result:res,sessionToken:token} = await result.json();
    this.props.updateToken(token);
    this.getWeather(res.lat, res.lon)
  }
  getWeather = async (lat: number, lon: number) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.REACT_APP_WEATHER_API_KEY}
  `)
    this.props.setWeather(result.json())
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ clicked: true })
    this.findParent()
  }


  render() {
    const { classes } = this.props;

    return (

      <div>
        <h1>Login</h1>
        <form autoComplete="off" onSubmit={this.handleSubmit}>

          <TextField
            className={classes.root}
            error={this.state.badEmail && this.state.clicked}
            helperText={this.state.badEmail && this.state.clicked ? "Must be a valid email" : ''}
            id="standard-basic"
            label="Email"
            onChange={(e) => this.setState({ email: e.target.value })}
          />
          <FormControl className='textField'>
            <InputLabel error={this.state.badPassword && this.state.clicked} htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              error={this.state.badPassword && this.state.clicked}

              id="standard-adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText error={this.state.badPassword && this.state.clicked}>{this.state.badPassword && this.state.clicked ? "Minimum 5 characters" : ''}</FormHelperText>
          </FormControl>

          <Button type="submit" variant="contained" color='primary'>Submit</Button>
        </form>
      </div>
    )
  }
}



export default withStyles(styles)(Login);