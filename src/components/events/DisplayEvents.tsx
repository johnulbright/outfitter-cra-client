
import React from 'react'

import {ChildKeys} from '../../types'

interface DisplayEventsProps{
    child:ChildKeys
    events:any[]
    showEdit:boolean
}

interface DisplayEventsState{
}

export default class DisplayEvents extends React.Component<DisplayEventsProps,DisplayEventsState>{
    constructor(props:DisplayEventsProps){
        super(props)
        this.state={
        }
    }
    
        
    render(){
        console.log(this.props.child.name,this.props.events)
        return(
            
            <div>
                {this.props.events?.map((event)=>{
                    let displayHours:number;
                    let displayMinutes:string=event.minutes<10?`0${event.minutes}`:`${event.minutes}`;
                    let AorP:string;
                    if (event.hours==0){
                            displayHours=12;
                            AorP="A";
                    } else if (event.hours>12){
                        displayHours=event.hours-12;
                        AorP="P";
                    } else if (event.hours==12){
                        displayHours=12;
                        AorP="P"
                    } else {
                        displayHours=event.hours;
                        AorP="A"
                    }

                    
                    return(<p>{event.name} {displayHours}:{displayMinutes} {AorP}M</p>)
                })}
            </div>
        )
    }
}