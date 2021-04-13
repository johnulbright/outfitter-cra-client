import React from 'react'

import EventIndex from '../events/EventIndex'
import ChangeChild from './ChangeChild'
import {ChildKeys} from '../../types'

interface ChildProps{
    child:ChildKeys;
    sessionToken:string;
    getAllUsernames: () => void;
    getMyChildren: () => void;

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
        return(
            <div>
            <h2>I'm {this.props.child.name}</h2>
            <ChangeChild 
                sessionToken={this.props.sessionToken} 
                child={this.props.child}
                getMyChildren={this.props.getMyChildren}
                getAllUsernames={this.props.getAllUsernames}

            />
            <EventIndex sessionToken={this.props.sessionToken} child={this.props.child}/>
            </div>
        )
        }
}