import React from 'react'
import TextField from '@material-ui/core'
import {withStyles} from '@material-ui/core'

interface SignupProps{
    clearToken:()=>void;
    updateToken:(newToken:string)=>void
}
interface SignupState{
}
       
export default class Signup extends React.Component<SignupProps,SignupState>{
    constructor(props:SignupProps){
        super(props)

    }
    
    
    render(){
        return(
            <div>
                Signup
                <form >
 
                

 </form>
            </div>
           
        )
    }
}
