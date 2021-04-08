import React from "react";
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
interface SignupProps{
    updateToken:(newToken:string)=>void
}
interface SignupState{
    password: string;
    zipCode: string;
    email: string;
    showPassword: boolean;
}
       
export default class Signup extends React.Component<SignupProps,SignupState>{
    constructor(props:SignupProps){
        super(props)
        this.state={
            password:'',
            zipCode:'',
            email:'',
            showPassword:false
          }  

    }
    handleClickShowPassword = () => {
        this.setState({showPassword: !this.state.showPassword });
      };
      
       handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
      }; 

      handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
          e.preventDefault();
      }
    
    
    render(){
        return(
           
      <div>
      <h1>Signup</h1>
      <form autoComplete="off" onSubmit={this.handleSubmit}>

        <TextField required id="standard-basic" label="Email" />
        <FormControl className='textField'>
        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
        <Input
          required
          id="standard-adornment-password"
          type={this.state.showPassword ? 'text' : 'password'}
          value={this.state.password}
          onChange={(e)=>this.setState({password:e.target.value})}
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
      </FormControl>
        <TextField required helperText="test" label="Zip Code" defaultValue="" />
      {/* <TextField
        error
        id="standard-error-helper-text"
        label="Error"
        defaultValue="Hello World"
        helperText="Incorrect entry."
      />
      <TextField
        error
        id="filled-error"
        label="Error"
        defaultValue="Hello World"
        variant="filled"
      />
      <TextField
        error
        id="filled-error-helper-text"
        label="Error"
        defaultValue="Hello World"
        helperText="Incorrect entry."
        variant="filled"
      />
      <TextField
        error
        id="outlined-error"
        label="Error"
        defaultValue="Hello World"
        variant="outlined"
      /> */}
    
      </form>
    </div>
        )
    }
}
