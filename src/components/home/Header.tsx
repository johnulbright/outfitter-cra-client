import React from 'react';
import Button from '@material-ui/core/Button'

import {Weather} from '../../types'


interface HeaderProps{
    clearToken:()=> void;
    weather:Weather;
    city:string|null;
}
interface HeaderState{
    // description:string;
    // temp:number;
    // icon:string;
}

export default class Header extends React.Component <HeaderProps,HeaderState>{
    constructor(props:HeaderProps){
        super(props);
        this.state={

        }
    }
    
    render(){
        console.log(this.props.weather)
    return(
    <div>
        <div>
        <h3>{this.props.city}</h3>
        <img src={`http://openweathermap.org/img/wn/${this.props.weather.current.weather[0].icon}@2x.png`}/>
        </div>
        <Button onClick={()=>console.log(this.props.weather)}>weather</Button>
        <Button onClick={this.props.clearToken}>Logout</Button></div>
    )
    }
}
