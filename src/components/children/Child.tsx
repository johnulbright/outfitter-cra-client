import React from 'react'

import Typography from '@material-ui/core/Typography'

import Paper from '@material-ui/core/Paper'
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
            
            <Paper style={{backgroundColor:'#e3dfc8',marginTop:'20px'}}>
            <Typography style={{color:'#3a5e25'}} variant="h3">{this.props.child.name}</Typography>
            <div style={{justifyContent:'center',flexWrap:"wrap"}}>
            <ChangeChild 
                sessionToken={this.props.sessionToken} 
                child={this.props.child}
                getMyChildren={this.props.getMyChildren}
                getAllUsernames={this.props.getAllUsernames}
                setActiveChild={this.props.setActiveChild}
            />
            <Outfit weather={this.props.weather} child={this.props.child} sessionToken={this.props.sessionToken}/>
            </div>
            </Paper>
        )
        }
}