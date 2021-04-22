import React from "react";
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
    let todaysEvents=[];
    let tomorrowsEvents=[];
    let todaysLow: number = this.props.weather.current.temp;
    let todaysHigh: number = this.props.weather.current.temp;
    let tomorrowsHigh: number = this.props.weather.daily[1].temp.max;
    let tomorrowsLow: number = this.props.weather.daily[1].temp.min;
    let todaysWeather = this.props.weather.hourly.filter(item=>{
      const day = new Date(item.dt * 1000).getDay();
      return(day==this.state.currentTime.getDay())
    });
    let todaysTemps=todaysWeather.map(i=>i.temp);
    if(todaysTemps&&Math.min(...todaysTemps)<todaysLow){
      todaysLow=Math.min(...todaysTemps);
    }
    if(todaysTemps&&Math.max(...todaysTemps)>todaysLow){
      todaysHigh=Math.max(...todaysTemps);
    }
    let tomorrowsWeather = this.props.weather.hourly.filter(item=>{
      const day = new Date(item.dt * 1000).getDay();
      return(day==this.state.currentTime.getDay()+1)
    });
  
     for (let i = 0; i < this.state.events.length; i++) {
       if(this.state.events[i].hours*60+this.state.events[i].minutes>this.state.currentTimeInMinutes){
         let closestTime: number = 48 * 60;
         let closestTimeObject: HourlyWeather = this.props.weather.hourly[0];
         for (let j=0;j<todaysWeather.length;j++){
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
         todaysEvents.push({"name":this.state.events[i].name,"weather":closestTimeObject})
       }
     }

     for (let i = 0; i < this.state.events.length; i++) {
        let closestTime: number = 48 * 60;
        let closestTimeObject: HourlyWeather = this.props.weather.hourly[0];
        for (let j=0;j<tomorrowsWeather.length;j++){
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
        tomorrowsEvents.push({"name":this.state.events[i].name,"weather":closestTimeObject})
    }
  
    this.setState({relevantWeather:{today: {
          high: todaysHigh,
          low: todaysLow,
          byEvent: todaysEvents,
        },
        tomorrow: {
          high: tomorrowsHigh,
          low: tomorrowsLow,
          byEvent: tomorrowsEvents,
        },
      },},(): void=>console.log(this.state.relevantWeather))

  }
  render() {
    return (
      <div>
        Outfit Time: {Math.floor(this.state.currentUnixTime / 1000)} and{" "}
        {this.state.currentTimeInMinutes} and {this.state.currentTime.getDay()}
        {this.state.events?.map((event) => {
          return (
            <p key={event.id}>
              {event.name} at {event.hours * 60 + event.minutes} and{" "}
              {(event.hours + 24) * 60 + event.minutes}
            </p>
          );
        })}
        {this.props.weather.hourly.map((time) => {
          const t = new Date(time.dt * 1000);
          return (
            <p key={time.dt}>
              {time.dt} date {t.getDate()} day {t.getDay()} HH:MM {t.getHours()}
              :{t.getMinutes()} {t.getHours() * 60 + t.getMinutes()}
            </p>
          );
        })}
      </div>
    );
  }
}
