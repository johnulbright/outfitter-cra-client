import React from 'react';
import Button from '@material-ui/core/Button'

import ChildIndex from '../children/ChildIndex';
import Header from './Header'
import {Weather} from '../../types'

interface HomeProps{
    clearToken:()=> void;
    sessionToken:string;
    weather:Weather
    city:string|null
}
interface HomeState{
    
}

export default class Home extends React.Component <HomeProps,HomeState>{
    constructor(props:HomeProps){
        super(props)
        this.state={
 
        }
    }

    render(){
        return(
            <div>
                <Header city={this.props.city} weather={this.props.weather} clearToken={this.props.clearToken}/>
                <ChildIndex sessionToken={this.props.sessionToken} weather={this.props.weather}/>
            </div>
        )
    }
}