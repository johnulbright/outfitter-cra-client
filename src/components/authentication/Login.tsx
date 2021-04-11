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


import APIURL from '../../helpers/environment.js'

interface LoginProps {
  updateToken: (newToken: string) => void;
  setLatLon:(latutide:number|null,longitude:number|null)=>void;
  setWeather:(weather:object)=>void;
}

interface LoginState {
  password: string;
  email: string;
  showPassword: boolean;
  badEmail: boolean;
  badPassword: boolean;
  parentId:number|null;
  clicked:boolean

}

export default class Login extends React.Component<LoginProps, LoginState>{
  constructor(props: LoginProps) {
    super(props)
    this.state = {
      password: '',
      email: '',
      showPassword: false,
      badEmail: false,
      badPassword: false,
      parentId:null,
      clicked:false
    }
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  

  findParent=async()=>{
    const result = await fetch(`${APIURL}/parent/login`,{
      method:'POST',
      body:JSON.stringify({parent:{
        email:this.state.email,
        password:this.state.password,
      }}),
      headers: new Headers({
        'Content-Type':"application/json"
      })
    });
    const res = await result.json();
    console.log(res);
    this.props.updateToken(res.sessionToken);
    this.props.setLatLon(res.lat,res.log);
    this.getWeather(res.lat,res.lon)
    console.log("ST=",res.sessionToken)
    
}
getWeather=async (lat:number,lon:number)=>{
  const result = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon} &exclude=minutely&appid=${process.env.REACT_APP_WEATHER_API_KEY}
  `)
  console.log("weather result",result)
  console.log(process.env.REACT_APP_WEATHER_API_KEY)
}
handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  this.setState({clicked:true})
  this.findParent();
  }


  render() {
    return (

      <div>
        <h1>Signup</h1>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
        
          <TextField
             error={this.state.badEmail&&this.state.clicked}
             helperText={this.state.badEmail&&this.state.clicked?"Must be a valid email":''}
            id="standard-basic"
            label="Email"
            onChange={(e) => this.setState({ email: e.target.value})}
          />
          <FormControl className='textField'>
            <InputLabel error={this.state.badPassword&&this.state.clicked} htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
               error={this.state.badPassword&&this.state.clicked}
               
              id="standard-adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value})}
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
            <FormHelperText error={this.state.badPassword&&this.state.clicked}>{this.state.badPassword&&this.state.clicked?"Minimum 5 characters":''}</FormHelperText>
          </FormControl>
          
          <Button type="submit" variant="contained" color='primary'>Submit</Button>
        </form>
      </div>
    )
  }
}
