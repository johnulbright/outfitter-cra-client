import React from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import Typography from '@material-ui/core/Typography'
import Auth from "./components/authentication/Auth";
import Home from "./components/home/Home";
// import "./App.css";
import { Weather } from "./types";

import APIURL from "./helpers/environment.js";
const styles = createStyles({
  root: {
    backgroundSize:'cover',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    width:'100vw',
    textAlign:'center',
    backgroundColor: '#fff8e1',
    margin:'0px'

  },
});
interface AppProps extends WithStyles<typeof styles> {
  classes:{
    root:string
  }
}
interface AppState {
  sessionToken: string;
  weather: Weather;
  city: string | null;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      sessionToken: "",
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
      city: "",
    };
    this.updateToken = this.updateToken.bind(this);
    this.clearToken = this.clearToken.bind(this);
  }
  updateToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    this.setState({ sessionToken: newToken });
  };
  clearToken = () => {
    localStorage.clear();
    this.setState({ sessionToken: "" });
  };
  setWeather = (weatherObj: Weather): void => {
    console.log(weatherObj);
    this.setState({ weather: weatherObj });
  };

  setCity = (city: string): void => {
    this.setState({ city: city });
  };

  checkToken = async (token: string) => {
    const result = await fetch(`${APIURL}/parent/`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: token,
      }),
    });
    console.log(result);
     if(result.status===200){
      const parent = await result.json();
      console.log(parent)
      this.getWeather(parent.lat, parent.lon,token)
      this.setCity(parent.city)
    // } else if(result.status===404){
    //   this.setState({badEmail:true})
    // } else if(result.status===401){
    //   this.setState({badPassword:true})
    // }
  } else {
    this.clearToken();
  }
  }
  getWeather = async (lat: number, lon: number,token:string) => {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.REACT_APP_WEATHER_API_KEY}
  `)
    const json=await result.json()
    this.setWeather(json)
    this.updateToken(token);

  }

  componentDidMount() {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      console.log("found a token");
      console.log(localToken);
      this.checkToken(localToken);
    } else {
      console.log("no token");
    }
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {this.state.sessionToken === localStorage.getItem("token") ? (
          <Home
            city={this.state.city}
            weather={this.state.weather}
            clearToken={this.clearToken}
            sessionToken={this.state.sessionToken}
          />
        ) : (
          <div>
   
          <Auth
            updateToken={this.updateToken}
            setWeather={this.setWeather}
            setCity={this.setCity}
          />
          </div>
        )}
      </div>
    );
  }
}
export default withStyles(styles)(App);