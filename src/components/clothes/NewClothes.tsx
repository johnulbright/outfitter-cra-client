import React from 'react'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

interface NewClothesProps{

}

interface NewClothesState{
    values:number[]
}

export default class NewClothes extends React.Component<NewClothesProps,NewClothesState>{
    constructor(props:NewClothesProps){
        super(props)
        this.state={
            values:[30,70]
        }
    }
     handleChange = (event: any, newValue: number | number[]) => {
        this.setState({values:newValue as number[]});
      };
    valuetext(value: number) {
        return `${value}°C`;
      }
    render(){
        return(
            <div>
            <Typography id="range-slider" gutterBottom>
              Temperature range
            </Typography>
            <Slider
              onChange={this.handleChange}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              getAriaValueText={this.valuetext}
            />
          </div>
        );
        
    }
}


