import React from "react";

import DisplayEvents from './DisplayEvents'
import NewEvent from './NewEvent'
import APIURL from '../../helpers/environment'

interface EventIndexProps{
    child:{
        id:number|null,
        name:string|null,
        username:string|null,
        deviceId?:string,
        parentId:number|null
    };
    sessionToken:string;
}

interface EventIndexState{
    events:object[]
}

export default class EventIndex extends React.Component<EventIndexProps,EventIndexState>{
    constructor(props:EventIndexProps){
        super(props);
        this.state={
            events:[]
        }
    }
    getEvents = async () => {
        const result = await fetch(`${APIURL}/event/all/${this.props.child.id}`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: this.props.sessionToken,
          }),
        });
        const events = await result.json();
        console.log(events)
        this.setState({ events: events });
      };
      componentDidMount(){
          this.getEvents();
      }
    render(){
        return(
            <div>
                Event index
                <NewEvent sessionToken={this.props.sessionToken} child={this.props.child} getEvents={this.getEvents}/>
                {this.state.events.length>0&&<DisplayEvents child={this.props.child} events={this.state.events}/>}
            </div>
        )
    }
}