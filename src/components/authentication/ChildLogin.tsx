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
import {Weather,ChildKeys} from '../../types'
import ChildOutfit from '../children/ChildOutfit'

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

interface ChildLoginProps extends WithStyles<typeof styles> {
  classes:{
    root:string;
    paper:string;
    button:string
  };
}

interface ChildLoginState {
  child:ChildKeys;
  username: string;
  badUsername: boolean;
  clicked: boolean;
  loggedIn:boolean;
  weather:Weather;
}



class ChildLogin extends React.Component<ChildLoginProps, ChildLoginState>{

  constructor(props: ChildLoginProps) {
    super(props)
    this.state = {
      child:{
          id:null,
          name:null,
          username:null,
          parentId: null,
      },
      username: '',
      badUsername: false,
      clicked: false,
      loggedIn:false,
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
    }
  }


  findChild = async () => {
    this.setState({clicked:true})
    const result = await fetch(`${APIURL}/child/login/${this.state.username}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': "application/json"
      })
    });
      if(result.status===200){
        console.log(result)
        const json=await result.json();
        console.log(json)
        this.setState({child:json});
        this.findParent(json.parentId)
      } else if(result.status===403){
        this.setState({badUsername:true})
      }  
  }
  findParent = async (id:number) => {
    const result = await fetch(`${APIURL}/parent/${id}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': "application/json"
      })
    });
      if(result.status===200){
        const json= await result.json();
        console.log(json)
        this.getWeather(json.lat, json.lon)
      } 
  }

  getWeather = async (lat: number, lon: number) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.REACT_APP_WEATHER_API_KEY}
  `)
    const json=await result.json()
    this.setState({weather:json,loggedIn:true})
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ clicked: true })
    this.findChild()
  }


  render() {
    const { classes } = this.props;

    return (
<div>
{this.state.loggedIn?
       (<ChildOutfit weather={this.state.weather} child={this.state.child}/>)
          :
          (<div>

          <h1>Login</h1>
          <form autoComplete="off" onSubmit={this.handleSubmit}>
  
            <TextField
              className={classes.root}
              error={this.state.badUsername && this.state.clicked}
              helperText={this.state.badUsername && this.state.clicked ? "Username not found.  Check with your parent." : ''}
              id="standard-basic"
              label="Username"
              onChange={(e) => this.setState({ username: e.target.value })}
            />
           
  
            <Button type="submit" variant="contained" color='primary'>Submit</Button>
          </form>
        </div>)
          }
</div>
          
    
    )
  }
}



export default withStyles(styles)(ChildLogin);