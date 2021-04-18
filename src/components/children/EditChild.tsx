import React from 'react'
import {ChildKeys} from '../../types'

interface EditChildProps{
    child:ChildKeys;
    sessionToken:string
}

interface EditChildState{

}

export default class EditChild extends React.Component<EditChildProps,EditChildState>{
    constructor(props:EditChildProps){
        super(props)
        this.state={

        }
    }

    render(){
        return(
            <div>
                <p>Edit {this.props.child.name}</p>
            </div>
        )
    }
}