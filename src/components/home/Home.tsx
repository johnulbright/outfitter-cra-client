import React from 'react';
import Button from '@material-ui/core/Button'

interface HomeProps{
    clearToken:()=> void;
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
                <h2>Home</h2>
                <Button onClick={this.props.clearToken}>Logout</Button>
            </div>
        )
    }
}