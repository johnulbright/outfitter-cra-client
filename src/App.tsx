import React from 'react'
import Auth from './components/authentication/Auth'
import Home from './components/home/Home'
import './App.css'
import {Weather} from './types'

interface AppProps{}
interface AppState{
  sessionToken:string;
  weather:Weather;
  city:string|null;
}


export default class App extends React.Component <AppProps,AppState>{
  constructor(props:AppProps){
    super(props)
    this.state={
    sessionToken:'',
    weather:{
      current:{
        temp:999,
        weather:[
          {
            description:'',
            icon:''
          }
        ]
      },
      hourly:[],
      daily:[]
    },
    city:''
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
setWeather=(weatherObj:Weather):void=>{
  console.log(weatherObj)
  this.setState({weather:weatherObj})
}
setCity=(city:string):void=>{
  this.setState({city:city})
}
// componentDidMount(){
//   const localToken=localStorage.getItem('token');
//   if (localToken){
//     this.setState({sessionToken:localToken})
//   }
// }
render(){
  return (
    <div className="App">
      {
      this.state.sessionToken===localStorage.getItem('token')
      ?
      <Home 
        city={this.state.city}
        weather={this.state.weather} 
        clearToken={this.clearToken}
        sessionToken={this.state.sessionToken}
      />
      :
      <Auth 
        updateToken={this.updateToken}
        setWeather={this.setWeather} 
        setCity={this.setCity}
      />
      }
    </div>
  )
}
}
  

