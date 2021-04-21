import React from "react";
import { Weather, ChildKeys, Clothes ,Event} from "../../types";
import APIURL from "../../helpers/environment";

interface OutfitProps {
  sessionToken: string;
  weather: Weather;
  child: ChildKeys;
}
interface OutfitState {
  clothes: Clothes[];
  events:Event[];
  currentUnixTime:number;
  currentTime:number;
}

export default class Outfit extends React.Component<OutfitProps, OutfitState> {
  constructor(props: OutfitProps) {
    super(props);
    this.state = {
      clothes: [],
      events:[],
      currentTime:0,
      currentUnixTime:0,
    };
  }
  componentDidMount() {
    this.getAllClothes();
    this.getAllEvents();
    const d=new Date();
    this.setState({currentUnixTime:d.getTime(),currentTime:d.getHours()*60+d.getMinutes()})
    console.log(this.state.clothes);
    console.log(this.props.weather.hourly)
  }
  getAllEvents = async () => {
    const result = await fetch(`${APIURL}/event/all/${this.props.child.id}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    let events = await result.json();
    events.sort((a:Event,b:Event):number=>{
        return (a.hours*60+a.minutes)-(b.hours*60+b.minutes)
    })
    this.setState({ events: events });
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
  render(){
      return(
          <div>
              Outfit
              Time: {this.state.currentUnixTime} and {this.state.currentTime}
              </div>
      )
  }
}
