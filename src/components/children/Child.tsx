import React from 'react'

import EventIndex from '../events/EventIndex'
import {ChildKeys} from './types'

interface ChildProps{
    child:ChildKeys;
    sessionToken:string;
}
interface ChildState{
}

export default class Child extends React.Component<ChildProps,ChildState>{
    constructor(props:ChildProps){
        super(props);
        this.state={
        }
    }

    render(){
        console.log(this.props.child)
        return(
            <div>
            <h2>I'm {this.props.child.name}</h2>
            <EventIndex sessionToken={this.props.sessionToken} child={this.props.child}/>
            </div>
        )
        }
}