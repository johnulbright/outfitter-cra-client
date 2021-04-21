import React from 'react'

import ChangeChild from './ChangeChild'
import Outfit from './Outfit'
import {ChildKeys,Weather} from '../../types'

interface ChildProps{
    weather:Weather;
    child:ChildKeys;
    sessionToken:string;
    getAllUsernames: () => void;
    getMyChildren: () => void;
    setActiveChild:(child:ChildKeys)=>void

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
                setActiveChild={this.props.setActiveChild}
            />
            <Outfit weather={this.props.weather} child={this.props.child} sessionToken={this.props.sessionToken}/>
            </div>
        )
        }
}