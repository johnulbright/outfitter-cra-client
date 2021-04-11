import React from 'react'
import Auth from './components/authentication/Auth'
import Home from './components/home/Home'
import './App.css'

interface AppProps{}
interface AppState{
  sessionToken:string,
  lat:number|null,
  lon:number|null,
  weather:object;
}


export default class App extends React.Component <AppProps,AppState>{
  constructor(props:AppProps){
    super(props)
    this.state={
    sessionToken:'',
    lat:null,
    lon:null,
    weather:{}
    }
  this.updateToken=this.updateToken.bind(this)
  this.clearToken=this.clearToken.bind(this)

}
updateToken=(newToken:string)=>{
  localStorage.setItem('token',newToken)
  this.setState({sessionToken:newToken})
}
clearToken=()=>{
  localStorage.clear()
  this.setState({sessionToken:''})
}
setLatLon=(latitude:number|null,longitude:number|null)=>{
  this.setState({lat:latitude,lon:longitude})
  console.log("lat",latitude,"lon",longitude)
}
setWeather=(weatherObj:object):void=>{
  this.setState({weather:weatherObj})
}

render(){
  return (
    <div className="App">
      <h1>Outfitter</h1>
      {
      this.state.sessionToken===localStorage.getItem('token')
      ?
      <Home 
        weather={this.state.weather} 
        lat={this.state.lat} 
        lon={this.state.lon} 
        clearToken={this.clearToken}
      />
      :
      <Auth 
        setLatLon={this.setLatLon}
        updateToken={this.updateToken}
        setWeather={this.setWeather} 
      />
      }
    </div>
  )
}
}
  

