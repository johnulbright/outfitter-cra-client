import React from "react";
import Dialog from '@material-ui/core/Dialog'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Add from '@material-ui/icons/Add'
import EventIcon from '@material-ui/icons/Event';

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
    events:Event[];
    openNewEvent: boolean;
    openEditEvent: boolean;

}

export default class EditEvents extends React.Component<EditEventsProps,EditEventsState>{
    constructor(props:EditEventsProps){
        super(props);
        this.state={
            events:[],
            openNewEvent: false,
            openEditEvent: false,
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
      setOpenNewEvent = (TorF: boolean) => {
        this.setState({ openNewEvent: TorF })
    }

    setOpenEditEvent = (TorF: boolean) => {
        this.setState({ openEditEvent: TorF })
    }
    render(){
        return(
            <div>
                Edit Events
                <Card onClick={() => this.setState({ openNewEvent: true })}>
                            <CardContent>
                                <Add fontSize='large' /><EventIcon fontSize='large' />
                            </CardContent>
                        </Card>
                <Dialog open={this.state.openNewEvent}>
                    <NewEvent 
                        sessionToken={this.props.sessionToken} 
                        child={this.props.child} 
                        getEvents={this.getEvents}
                        setOpenNewEvent={this.setOpenNewEvent}/>

                </Dialog>
                {this.state.events.length>0&&<DisplayEvents getEvents={this.getEvents} sessionToken={this.props.sessionToken} showEdit={this.props.showEdit} child={this.props.child} events={this.state.events}/>}
            </div>
        )
    }
}