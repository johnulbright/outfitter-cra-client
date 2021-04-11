import React from 'react'
import Auth from './components/authentication/Auth'
import Home from './components/home/Home'
import './App.css'

interface AppProps{}
interface AppState{
  sessionToken:string,
  weather:object;
}


export default class App extends React.Component <AppProps,AppState>{
  constructor(props:AppProps){
    super(props)
    this.state={
    sessionToken:'',
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
        clearToken={this.clearToken}
        sessionToken={this.state.sessionToken}
      />
      :
      <Auth 
        updateToken={this.updateToken}
        setWeather={this.setWeather} 
      />
      }
    </div>
  )
}
}
  

