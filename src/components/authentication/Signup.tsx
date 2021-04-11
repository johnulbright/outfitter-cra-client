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

interface SignupProps {
  updateToken: (newToken: string) => void;
  setWeather:(weather:object)=>void;

}
interface SignupState {
  password: string;
  zipCode: string;
  email: string;
  showPassword: boolean;
  badFirstName:boolean;
  badLastName:boolean;
  badZip: boolean;
  badEmail: boolean;
  badPassword: boolean;
  lat:number|null;
  lon:number|null;
  firstName:string;
  lastName:string;
  timeZone:number|null;
  parentId:number|null;
  clicked:boolean

}

export default class Signup extends React.Component<SignupProps, SignupState>{
  constructor(props: SignupProps) {
    super(props)
    this.state = {
      password: '',
      zipCode: '',
      email: '',
      showPassword: false,
      badFirstName:true,
      badLastName:true,
      badZip: true,
      badEmail: true,
      badPassword: true,
      lat:null,
      lon:null,
      firstName:'',
      lastName:'',
      timeZone:null,
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


  getLatLong=()=>{
    fetch(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=&refine.zip=${this.state.zipCode}`)
    .then(res=>res.json())
    .then((json)=>{
      console.log(json.records[0].fields)
      this.setState({
        lat:json.records[0].fields.latitude,
        lon:json.records[0].fields.longitude,
        timeZone:json.records[0].fields.timezone
      })
    })
    .then(()=>{
      this.createParent()
    })
  }

  createParent=async()=>{
    const result = await fetch(`${APIURL}/parent/signup`,{
      method:'POST',
      body:JSON.stringify({parent:{
        email:this.state.email,
        password:this.state.password,
        firstName:this.state.firstName,
        lastName:this.state.lastName,
        zipCode:this.state.zipCode,
        lat:this.state.lat,
        lon:this.state.lon,
        timeZone:this.state.timeZone
      }}),
      headers: new Headers({
        'Content-Type':"application/json"
      })
    });
    const res = await result.json();
    console.log(res)
    // this.props.setLatLon(this.state.lat,this.state.lon);
    this.props.updateToken(res.sessionToken)
}

handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  this.setState({clicked:true})
  let ready=!this.state.badFirstName&&!this.state.badLastName&&!this.state.badZip&&!this.state.badEmail&&!this.state.badPassword
  if (ready){
    this.getLatLong();
  }
}
  validateEmail(email:string):boolean {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

  render() {
    return (

      <div>
        <h1>Signup</h1>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
        <TextField
            error={this.state.badFirstName&&this.state.clicked}
            helperText={this.state.badFirstName&&this.state.clicked?"Required":''}
            label="First Name"
            defaultValue=""
            onChange={(e) => this.setState({ firstName: e.target.value,badFirstName:e.target.value.length===0 })}
          />
          <TextField
            error={this.state.badLastName&&this.state.clicked}
            helperText={this.state.badLastName&&this.state.clicked?"Required":''}
            label="Last name"
            defaultValue=""
            onChange={(e) => this.setState({ lastName: e.target.value,badLastName:e.target.value.length===0})}
          />
        <TextField
            error={this.state.badZip&&this.state.clicked}
            helperText={this.state.badZip&&this.state.clicked?"Required (5 digits only)":''}
            label="Zip Code"
            defaultValue=""
            onChange={(e) => this.setState({ zipCode: e.target.value, badZip:e.target.value.length!==5||isNaN(Number(this.state.zipCode))})}
          />
          <TextField
             error={this.state.badEmail&&this.state.clicked}
             helperText={this.state.badEmail&&this.state.clicked?"Must be a valid email":''}
            id="standard-basic"
            label="Email"
            onChange={(e) => this.setState({ email: e.target.value,badEmail:!this.validateEmail(e.target.value) })}
          />
          <FormControl className='textField'>
            <InputLabel error={this.state.badPassword&&this.state.clicked} htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
               error={this.state.badPassword&&this.state.clicked}
               
              id="standard-adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value,badPassword:e.target.value.length<5 })}
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
