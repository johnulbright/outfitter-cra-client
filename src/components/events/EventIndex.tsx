import React from "react";
import {Event} from '../../types'
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
    showEdit:boolean
}

interface EventIndexState{
    events:Event[]
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
        let events = await result.json();
        console.log(events)
        events.sort((a:Event,b:Event):number=>{
            return (a.hours*60+a.minutes)-(b.hours*60+b.minutes)
        })
        console.log(events)
        this.setState({ events: events });
      };
      componentDidMount(){
        //   this.getEvents();
        // revisit this for editing children
      }
    render(){
        return(
            <div>
                <NewEvent setOpenNewEvent={(TorF:boolean)=>{}} sessionToken={this.props.sessionToken} child={this.props.child} getEvents={this.getEvents}/>
                {this.state.events.length>0&&<DisplayEvents getEvents={this.getEvents} sessionToken={this.props.sessionToken} showEdit={this.props.showEdit} child={this.props.child} events={this.state.events}/>}
            </div>
        )
    }
}