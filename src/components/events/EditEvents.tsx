import React from "react";
import Dialog from '@material-ui/core/Dialog'
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
        const events = await result.json();
        const sortedEvents:Event[]=events.sort((a:Event,b:Event)=>{
            return (a.hours*60+a.minutes)-(b.hours*60+b.minutes)
        })
        this.setState({ events: sortedEvents });
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
                <div style={{display:'inline-block'}} onClick={() => this.setState({ openNewEvent: true })}>
                            <CardContent style={{color:"#678b4f"}}>
                                <Add fontSize='large' /><EventIcon fontSize='large' />
                            </CardContent>
                        </div>
                <Dialog open={this.state.openNewEvent}>
                  
                        <NewEvent 
                        showCancel={true}
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