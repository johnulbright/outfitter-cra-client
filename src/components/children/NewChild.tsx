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
import Checkbox from '@material-ui/core/Checkbox'


import APIURL from '../../helpers/environment.js'

interface NewChildProps {
    sessionToken:string;
}
interface NewChildState {
  name: string;
  username: string;
  deviceId: string;
  underwearRemind: boolean;
  badName:boolean;
  badUsername:boolean;
  clicked:boolean
}

export default class NewChild extends React.Component<NewChildProps, NewChildState>{
  constructor(props: NewChildProps) {
    super(props)
    this.state = {
      name: '',
      username: '',
      deviceId: '',
      underwearRemind: false,
      badName:true,
      badUsername:true,
      clicked:false
    }

  }



  createChild=async()=>{
    const result = await fetch(`${APIURL}/child/create`,{
      method:'POST',
      body:JSON.stringify({child:{
        name:this.state.name,
        username:this.state.username,
        underwearRemind:this.state.underwearRemind,
        deviceId:this.state.deviceId
      }}),
      headers: new Headers({
        'Content-Type':"application/json",
        'Authorization':this.props.sessionToken
      })
    });
    const res = await result.json();
    console.log(res)
}

handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  this.setState({clicked:true})
  let ready=!this.state.badName&&!this.state.badUsername
  if (ready){
      this.createChild();
  }
}

  render() {
    return (

      <div>
        <h1>New child</h1>
        <form autoComplete="off" onSubmit={this.handleSubmit}>
        <TextField
            error={this.state.badName&&this.state.clicked}
            helperText={this.state.badName&&this.state.clicked?"Required":''}
            label="Name"
            defaultValue=""
            onChange={(e) => this.setState({ name: e.target.value,badName:e.target.value.length===0 })}
          />
          <TextField
            error={this.state.badUsername&&this.state.clicked}
            helperText={this.state.badUsername&&this.state.clicked?"Required":''}
            label="User name"
            defaultValue=""
            onChange={(e) => this.setState({ username: e.target.value,badUsername:e.target.value.length===0})}
          />
        
           <Checkbox
        checked={this.state.underwearRemind}
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
        onChange={(event)=>this.setState({underwearRemind:event.target.checked})}
      />       
          <Button type="submit" variant="contained" color='primary'>Submit</Button>
        </form>
      </div>
    )
  }
}
