import React from 'react';
import Button from '@material-ui/core/Button'

import NewChild from '../children/NewChild';
import Child from '../children/Child';
import APIURL from '../../helpers/environment.js'


interface HomeProps{
    clearToken:()=> void;
    sessionToken:string;
    weather:object
}
interface HomeState{
    children:object[]
}

export default class Home extends React.Component <HomeProps,HomeState>{
    constructor(props:HomeProps){
        super(props)
        this.state={
            children:[],
        }
    }
getChildren=async ()=>{
    const result = await fetch(`${APIURL}/child/all`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': "application/json",
        'Authorization':this.props.sessionToken
      })
    });
    const allChildren = await result.json();
    console.log('all childs',allChildren);
    this.setState({children:allChildren})
  }    
    componentWillMount(){
        this.getChildren();
    }
    render(){
        return(
            <div>
                <h2>Home</h2>
                <Button onClick={this.props.clearToken}>Logout</Button>
                <NewChild sessionToken={this.props.sessionToken}/>
                {this.state.children?.map(child=><Child child={child}/>)}
            </div>
        )
    }
}