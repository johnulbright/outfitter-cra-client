import React from 'react';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import { Weather } from '../../types'


interface WeatherConditionsProps {
    weather: Weather;
    city: string | null;
}
interface WeatherConditionsState {

}

export default class WeatherConditions extends React.Component<WeatherConditionsProps, WeatherConditionsState>{
    constructor(props: WeatherConditionsProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log(this.props.weather)
        return (
                <Grid container 
                >
              
                    <Paper 
                    >
                    <Typography variant='h5'>{this.props.city} weather:</Typography>

                        <h4>Currently</h4>
                        <p>{this.props.weather.current.temp !== 999 && Math.round((this.props.weather.current.temp - 273.15) * 1.8 + 32)}° </p>
                        <img src={`http://openweathermap.org/img/wn/${this.props.weather.current.weather[0].icon}@2x.png`} />
                    <p>{this.props.weather.current.weather[0].description}</p>

                    </Paper>
                    <Card
                    >
                        <h4>Today</h4>
                        <p>{Math.round((this.props.weather.daily[0].temp.max - 273.15) * 1.8 + 32)}° / {Math.round((this.props.weather.daily[0].temp.min - 273.15) * 1.8 + 32)}° </p>
                        <img src={`http://openweathermap.org/img/wn/${this.props.weather.daily[0].weather[0].icon}@2x.png`} />
                    <p>{this.props.weather.daily[0].weather[0].description}</p>

                    </Card>
                    <Card style={{margin:"auto"}}
                    >
                        <h4>Tomorrow</h4>
                        <p>{Math.round((this.props.weather.daily[1].temp.max - 273.15) * 1.8 + 32)}° / {Math.round((this.props.weather.daily[1].temp.min - 273.15) * 1.8 + 32)}° </p>
                        <img src={`http://openweathermap.org/img/wn/${this.props.weather.daily[1].weather[0].icon}@2x.png`} />
                    <p>{this.props.weather.daily[1].weather[0].description}</p>

                    </Card>

                    
                </Grid>
                
        )
    }
}
