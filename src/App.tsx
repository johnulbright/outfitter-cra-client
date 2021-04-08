import React from 'react'
import Auth from './components/authentication/Auth'
import './App.css'

interface AppProps{}
interface AppState{
  sessionToken:string
}


export default class App extends React.Component <AppProps,AppState>{
  constructor(props:AppProps){
    super(props)
    this.state={
    sessionToken:''
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

render(){
  return (
    <div className="App">
      <h1>Outfitter</h1>
      <Auth sessionToken={this.state.sessionToken} updateToken={this.updateToken} clearToken={this.clearToken}/>
    </div>
  )
}
}
  

