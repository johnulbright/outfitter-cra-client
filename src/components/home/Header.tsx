import React from 'react';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import { Weather } from '../../types'


interface HeaderProps {
    clearToken: () => void;
    weather: Weather;
    city: string | null;
}
interface HeaderState {

}

export default class Header extends React.Component<HeaderProps, HeaderState>{
    constructor(props: HeaderProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        console.log(this.props.weather)
        return (
            <div>
                <Grid
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="center"
                >   
                    <h2>Outfitter</h2>
                    <h3>{this.props.city} weather:</h3>
                    <Box
                    >
                        <h4>Currently</h4>
                        <p>{this.props.weather.current.temp !== 999 && Math.round((this.props.weather.current.temp - 273.15) * 1.8 + 32)}° </p>
                        <img src={`http://openweathermap.org/img/wn/${this.props.weather.current.weather[0].icon}@2x.png`} />
                    <p>{this.props.weather.current.weather[0].description}</p>

                    </Box>
                    <Box
                    >
                        <h4>Today</h4>
                        <p>{Math.round((this.props.weather.daily[0].temp.max - 273.15) * 1.8 + 32)}° / {Math.round((this.props.weather.daily[0].temp.min - 273.15) * 1.8 + 32)}° </p>
                        <img src={`http://openweathermap.org/img/wn/${this.props.weather.daily[0].weather[0].icon}@2x.png`} />
                    <p>{this.props.weather.daily[0].weather[0].description}</p>

                    </Box>
                    <Box
                    >
                        <h4>Tomorrow</h4>
                        <p>{Math.round((this.props.weather.daily[1].temp.max - 273.15) * 1.8 + 32)}° / {Math.round((this.props.weather.daily[1].temp.min - 273.15) * 1.8 + 32)}° </p>
                        <img src={`http://openweathermap.org/img/wn/${this.props.weather.daily[1].weather[0].icon}@2x.png`} />
                    <p>{this.props.weather.daily[1].weather[0].description}</p>

                    </Box>

                    <Button onClick={this.props.clearToken}>Logout</Button></Grid>
            </div>
        )
    }
}
