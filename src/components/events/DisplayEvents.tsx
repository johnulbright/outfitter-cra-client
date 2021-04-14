
import React from 'react'

import {ChildKeys} from '../../types'

interface DisplayEventsProps{
    child:ChildKeys
    events:any[]
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
                    return(<p>{event.name}</p>)
                })}
            </div>
        )
    }
}