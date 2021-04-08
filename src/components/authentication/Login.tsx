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
// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       "& > *": {
//         margin: theme.spacing(1),
//         width: "25ch",
//       },
//     },
//   })
// );
interface LoginProps {
  clearToken: () => void;
  updateToken: (newToken: string) => void;
}
interface LoginState {
    password: string;
    zipCode: string;
    email: string;
    showPassword: boolean;
}

export default class Login extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
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

  render(): JSX.Element {
    return (
      <div>
        <h1>Login</h1>
        <form autoComplete="off">

          <TextField id="standard-basic" label="Email" />
          <FormControl className='textField'>
          <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
          <Input
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
          <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          <TextField error id="standard-error" label="Error" defaultValue="Hello World" />
        <TextField
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
        />
        <TextField
          error
          id="outlined-error-helper-text"
          label="Error"
          defaultValue="Hello World"
          helperText="Incorrect entry."
          variant="outlined"
        />
        </form>
      </div>
    );
  }
}
