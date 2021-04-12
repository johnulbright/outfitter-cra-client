import React from 'react'

interface ChildProps{
    child:{
        name:string,
        username:string,
        deviceId?:string,
        parentId:number
    };
}
interface ChildState{
}

export default class Child extends React.Component<ChildProps,ChildState>{
    constructor(props:ChildProps){
        super(props);
        this.state={
        }
    }

    render(){
        return(
            <h2>I'm {this.props.child.name}</h2>
        )
        }
}