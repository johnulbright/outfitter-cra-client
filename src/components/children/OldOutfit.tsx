import React from "react";
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import Icon from '../clothes/Icon'
import { Weather, ChildKeys, Clothes, Event, HourlyWeather } from "../../types";
import APIURL from "../../helpers/environment";

interface OutfitProps {
  sessionToken: string;
  weather: Weather;
  child: ChildKeys;
}
interface OutfitState {
  currentTime: Date;
  clothes: Clothes[];
  events: Event[];
  currentUnixTime: number;
  currentTimeInMinutes: number;
  relevantWeather: {
    today: {
      high: number;
      low: number;
      byEvent: {
        name: string;
        weather: HourlyWeather;
      }[];
    };
    tomorrow: {
      high: number;
      low: number;
      byEvent: {
        name: string;
        weather: HourlyWeather;
      }[];
    };
  };
  todaysClothes: {
    required: Clothes[],
    optional: Clothes[]
  };
  tomorrowsClothes: {
    required: Clothes[],
    optional: Clothes[]
  };
}

export default class Outfit extends React.Component<OutfitProps, OutfitState> {
  constructor(props: OutfitProps) {
    super(props);
    this.state = {
      currentTime: new Date(),
      clothes: [],
      events: [],
      currentTimeInMinutes: 0,
      currentUnixTime: 0,
      relevantWeather: {
        today: {
          high: 0,
          low: 300,
          byEvent: [],
        },
        tomorrow: {
          high: 0,
          low: 300,
          byEvent: [],
        },
      },
      todaysClothes: {
        required: [],
        optional: []
      },
      tomorrowsClothes: {
        required: [],
        optional: []
      }
    };
  }
  componentDidMount() {
    this.getAllClothes();
    this.getAllEvents();
    const d = new Date();
    this.setState({
      currentUnixTime: d.getTime(),
      currentTimeInMinutes: d.getHours() * 60 + d.getMinutes(),
    });
  }
  getAllEvents = async () => {
    const result = await fetch(`${APIURL}/event/all/${this.props.child.id}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    let list = await result.json();
    let sortedEvents = list.sort((a: Event, b: Event): number => {
      return a.hours * 60 + a.minutes - (b.hours * 60 + b.minutes);
    });
    this.setState({ events: sortedEvents }, () => this.getRelevantWeather());
  };
  getAllClothes = async () => {
    const result = await fetch(
      `${APIURL}/clothing/all/${this.props.child.id}`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: this.props.sessionToken,
        }),
      }
    );
    const clothes = await result.json();
    this.setState({ clothes: clothes });
  };
  getRelevantWeather = (): void => {
    let todaysEvents = [];
    let tomorrowsEvents = [];
    let todaysLow: number = this.props.weather.current.temp;
    let todaysHigh: number = this.props.weather.current.temp;
    let tomorrowsHigh: number = this.props.weather.daily[1].temp.max;
    let tomorrowsLow: number = this.props.weather.daily[1].temp.min;
    let todaysWeather = this.props.weather.hourly.filter(item => {
      const day = new Date(item.dt * 1000).getDay();
      return (day == this.state.currentTime.getDay())
    });
    let todaysTemps = todaysWeather.map(i => i.temp);
    if (todaysTemps && Math.min(...todaysTemps) < todaysLow) {
      todaysLow = Math.min(...todaysTemps);
    }
    if (todaysTemps && Math.max(...todaysTemps) > todaysLow) {
      todaysHigh = Math.max(...todaysTemps);
    }
    let tomorrowsWeather = this.props.weather.hourly.filter(item => {
      const day = new Date(item.dt * 1000).getDay();
      return (day == this.state.currentTime.getDay() + 1)
    });

    for (let i = 0; i < this.state.events.length; i++) {
      if (this.state.events[i].hours * 60 + this.state.events[i].minutes > this.state.currentTimeInMinutes) {
        let closestTime: number = 48 * 60;
        let closestTimeObject: HourlyWeather = this.props.weather.hourly[0];
        for (let j = 0; j < todaysWeather.length; j++) {
          const readableWeatherTime = new Date(todaysWeather[j].dt);
          const timeDistance = Math.abs(
            this.state.events[i].hours * 60 +
            this.state.events[i].minutes -
            readableWeatherTime.getHours() * 24 -
            readableWeatherTime.getMinutes()
          );
          if (timeDistance < closestTime) {
            closestTime = timeDistance;
            closestTimeObject = todaysWeather[j];
          }

        }
        todaysEvents.push({ "name": this.state.events[i].name, "weather": closestTimeObject })
      }
    }

    for (let i = 0; i < this.state.events.length; i++) {
      let closestTime: number = 48 * 60;
      let closestTimeObject: HourlyWeather = this.props.weather.hourly[0];
      for (let j = 0; j < tomorrowsWeather.length; j++) {
        const readableWeatherTime = new Date(tomorrowsWeather[j].dt);
        const timeDistance = Math.abs(
          this.state.events[i].hours * 60 +
          this.state.events[i].minutes -
          readableWeatherTime.getHours() * 24 -
          readableWeatherTime.getMinutes()
        );
        if (timeDistance < closestTime) {
          closestTime = timeDistance;
          closestTimeObject = tomorrowsWeather[j];
        }

      }
      tomorrowsEvents.push({ "name": this.state.events[i].name, "weather": closestTimeObject })
    }

    this.setState({
      relevantWeather: {
        today: {
          high: todaysHigh,
          low: todaysLow,
          byEvent: todaysEvents,
        },
        tomorrow: {
          high: tomorrowsHigh,
          low: tomorrowsLow,
          byEvent: tomorrowsEvents,
        },
      },
    }, (): void => {
      this.getTodaysOutfits()
      this.getTomorrowsOutfits()
    }
      )

  }
  getTodaysOutfits = () => {
    let required: Clothes[] = [];
    let optional: Clothes[] = [];
    for (const clothes of this.state.clothes) {
      if (this.state.relevantWeather.today.byEvent.length === 0) {
        let highTemp = Math.floor((this.state.relevantWeather.today.high - 273.15) * 1.8 + 32)
        let lowTemp = Math.floor((this.state.relevantWeather.today.low - 273.15) * 1.8 + 32)
        console.log(lowTemp,highTemp)
        if(clothes.requiredMin!=null){console.log(clothes.name,"test1",clothes.requiredMin,lowTemp,clothes.requiredMin<lowTemp)}
        if(clothes.requiredMax!=null){console.log(clothes.name,"test2",clothes.requiredMax,highTemp,clothes.requiredMax>highTemp)}

        if (clothes.requiredMin !== null && clothes.requiredMin < lowTemp && clothes.requiredMax !== null && clothes.requiredMax > highTemp) {
          console.log("this should run for",clothes.name)
          required.push(clothes)
        } else if (clothes.optionalMin !== null && clothes.optionalMin < lowTemp && clothes.optionalMax !== null && clothes.optionalMax > highTemp) {
          optional.push(clothes);
        }
      } else {
        for (const element of this.state.relevantWeather.today.byEvent) {
          const temp = Math.floor((element.weather.temp - 273.15) * 1.8 + 32)
          console.log(temp)
          if (clothes.requiredMin !== null && clothes.requiredMin < temp && clothes.requiredMax !== null && clothes.requiredMax > temp) {
            required.push(clothes)
          } else if (clothes.optionalMin !== null && clothes.optionalMin < temp && clothes.optionalMax !== null && clothes.optionalMax > temp) {
            optional.push(clothes);
          }
        }
      }

    }
    required = required.filter(this.onlyUnique)
    optional = optional.filter(this.onlyUnique)
    optional = optional.filter( ( el ) => !required.includes( el ) );
    console.log(this.props.child.name, "required", required)
    console.log(this.props.child.name, "optional", optional)
    this.setState({ todaysClothes: { required: required, optional: optional } })
  }
  getTomorrowsOutfits = () => {
    let required: Clothes[] = [];
    let optional: Clothes[] = [];
    for (const clothes of this.state.clothes) {
      if (this.state.relevantWeather.tomorrow.byEvent.length === 0) {
        let highTemp = Math.floor((this.state.relevantWeather.tomorrow.high - 273.15) * 1.8 + 32)
        let lowTemp = Math.floor((this.state.relevantWeather.tomorrow.low - 273.15) * 1.8 + 32)
        if (clothes.requiredMin !== null && clothes.minTemp < lowTemp && clothes.requiredMax !== null && clothes.requiredMax > highTemp) {
          required.push(clothes)
        } else if (clothes.optionalMin !== null && clothes.optionalMin < lowTemp && clothes.optionalMax !== null && clothes.optionalMax > highTemp) {
          optional.push(clothes);
        }
      } else {
        for (const element of this.state.relevantWeather.tomorrow.byEvent) {
          const temp = Math.floor((element.weather.temp - 273.15) * 1.8 + 32)
          console.log(temp)
          if (clothes.requiredMin !== null && clothes.requiredMin < temp && clothes.requiredMax !== null && clothes.requiredMax > temp) {
            required.push(clothes)
          } else if (clothes.optionalMin !== null && clothes.optionalMin < temp && clothes.optionalMax !== null && clothes.optionalMax > temp) {
            optional.push(clothes);
          }
        }
      }

    }
    required = required.filter(this.onlyUnique)
    optional = optional.filter(this.onlyUnique)
    optional = optional.filter( ( el ) => !required.includes( el ) );
    
    console.log(this.props.child.name, "required", required)
    console.log(this.props.child.name, "optional", optional)
    this.setState({ tomorrowsClothes: { required: required, optional: optional } })
  }
  onlyUnique(value: any, index: any, self: any) {
    return self.indexOf(value) === index;
  }

  render() {
    return (
      <Grid container >
        <Grid item xs={6}>
          <Paper>
            <Typography variant="h5">
              Today's Clothes:
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h6">Required</Typography>
                <List>
                  {this.state.todaysClothes.required?.map((item) => {
                    return (
                      <ListItem>
                        <ListItemIcon>
                          {item.icon !== null && item.icon !== "" && <Icon size={1} isSelected={false} setIcon={()=>{}} icon={item.icon} />}
                        </ListItemIcon>
                        <ListItemText>{item.name}
                        </ListItemText>
                      </ListItem>
                    )
                  })

                  }
                </List>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Optional</Typography>
                <List>
                  {this.state.todaysClothes.optional?.map((item) => {
                    return (
                      <ListItem>
                        <ListItemIcon>
                        {item.icon !== null && item.icon !== "" && <Icon size={1} isSelected={false} setIcon={()=>{}} icon={item.icon} />}
                        </ListItemIcon>
                        <ListItemText>{item.name}
                        </ListItemText>
                      </ListItem>
                    )
                  })

                  }
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Typography variant="h5">
              Tomorrow's Clothes:
            </Typography>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h6">Required</Typography>
                <List>
                  {this.state.tomorrowsClothes.required?.map((item) => {
                    return (
                      <ListItem>
                        <ListItemIcon>
                        {item.icon !== null && item.icon !== "" && <Icon size={1} isSelected={false} setIcon={()=>{}} icon={item.icon} />}
                        </ListItemIcon>
                        <ListItemText>{item.name}
                        </ListItemText>
                      </ListItem>
                    )
                  })

                  }
                </List>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Optional</Typography>
                <List>
                  {this.state.tomorrowsClothes.optional?.map((item) => {
                    return (
                      <ListItem>
                        <ListItemIcon>
                        {item.icon !== null && item.icon !== "" && <Icon size={1} isSelected={false} setIcon={()=>{}} icon={item.icon} />}
                        </ListItemIcon>
                        <ListItemText>{item.name}
                        </ListItemText>
                      </ListItem>
                    )
                  })

                  }
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}
