import React from "react";

import DisplayEvents from './DisplayEvents'
import NewEvent from './NewEvent'
import {ChildKeys,Event} from '../../types'
import APIURL from '../../helpers/environment'

interface EditEventsProps{
    child:ChildKeys;
    sessionToken:string;
    showEdit:boolean
}

interface EditEventsState{
    events:Event[]
}

export default class EditEvents extends React.Component<EditEventsProps,EditEventsState>{
    constructor(props:EditEventsProps){
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
           this.getEvents();
        // revisit this for editing children
      }
    render(){
        return(
            <div>
                Event index
                <NewEvent sessionToken={this.props.sessionToken} child={this.props.child} getEvents={this.getEvents}/>
                {this.state.events.length>0&&<DisplayEvents showEdit={this.props.showEdit} child={this.props.child} events={this.state.events}/>}
            </div>
        )
    }
}