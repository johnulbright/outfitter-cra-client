import React from 'react'

interface ChildProps{
    classes:{
        name:string
    }
}
interface ChildState{
    childName:string;
}

export default class Child extends React.Component<ChildProps,ChildState>{
    constructor(props:ChildProps){
        super(props);
        this.state={
            childName:this.props.classes.name           
        }
    }

    render(){
        const {classes}=this.props
        return(
            <h2>I'm {this.props.classes.name}</h2>
        )
        }
}