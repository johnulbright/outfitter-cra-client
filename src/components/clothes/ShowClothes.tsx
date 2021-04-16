import React from 'react'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

import {marks} from '../../types'
import {ChildKeys} from '../../types'
import APIURL from '../../helpers/environment'

interface ShowClothesProps {
//   child:ChildKeys
//   sessionToken:string
  clothes:any[]
}

interface ShowClothesState {
 
}

export default class ShowClothes extends React.Component<ShowClothesProps, ShowClothesState>{
  constructor(props: ShowClothesProps) {
    super(props)
    this.state = {


    }
  }
   

  render() {
    return (

      <div>
        {this.props.clothes?.map((item)=>{
            return(
                <div key = {item.id}>
            <p>{item.name}</p>
            </div>
            )
        })}
      </div>
    );

  }
}


