import React from "react";

import NewEvent from './NewEvent'

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

}

export default class EventIndex extends React.Component<EventIndexProps,EventIndexState>{
    constructor(props:EventIndexProps){
        super(props);
        this.state={

        }
    }
    getEvents=():void=>{

    }

    render(){
        console.log(this.props.child)
        return(
            <div>
                Event index
                <NewEvent sessionToken={this.props.sessionToken} child={this.props.child} getEvents={this.getEvents}/>
            </div>
        )
    }
}