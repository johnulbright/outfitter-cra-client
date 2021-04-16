import React from 'react'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


import {marks} from '../../types'
import {ChildKeys} from '../../types'
import APIURL from '../../helpers/environment'
import ShowClothes from './ShowClothes'

interface NewClothesProps {
  child:ChildKeys
  sessionToken:string
}

interface NewClothesState {
  requiredValues: number[];
  optionalValues: number[];
  name:string;
  category:string;
  requiredMinTemp:number|null;
  requiredMaxTemp:number|null;
  optionalMinTemp:number|null;
  optionalMaxTemp:number|null;
  icon:string;
  required:boolean;
  optional:boolean;
  clothes:any[];
  clicked:boolean;
}

type NewType = Promise<void>;

export default class NewClothes extends React.Component<NewClothesProps, NewClothesState>{
  constructor(props: NewClothesProps) {
    super(props)
    this.state = {
      requiredValues: [30, 70],
      optionalValues: [30, 70],
      name:'',
      category:'',
      requiredMinTemp:null,
      requiredMaxTemp:null,
      optionalMinTemp:null,
      optionalMaxTemp:null,
      icon:'',
      required:true,
      optional:false,
      clothes:[],
      clicked:false
    }
  }
   
  handleRequiredChange = (event: any, newValue: number | number[]) => {
    this.setState({requiredValues:newValue as number[]});
  };
  handleOptionalChange = (event: any, newValue: number | number[]) => {
    this.setState({optionalValues:newValue as number[]});
  };

  handleSubmit=():void=>{
    this.setState({clicked:true})
    this.addClothes(true,this.state.requiredValues)
    this.addClothes(false,this.state.optionalValues)

    
  }
  valuetext(value: number) {
    return `${value}°F`;
  }
  addClothes=async(required:boolean,values:number[]): Promise<void>=>{
    await fetch(`${APIURL}/clothing/create/${this.props.child.id}`,{
      method: "POST",
      body: JSON.stringify({
        clothing: {
          name: this.state.name,
          icon: this.state.icon,
          category: this.state.category,
          minTemp:Math.min(...values),
          maxTemp:Math.max(...values),
          required:required
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    // const res=await result.json()
    this.getAllClothes();
  }
  getAllClothes=async()=>{
    const result = await fetch(`${APIURL}/clothing/all/${this.props.child.id}`,{
      method:"GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      })
    })
    const clothes=await result.json();
    console.log(clothes)
    this.setState({clothes:clothes})
  }

  render() {
    return (
      <div>
        <div>
        <TextField
            error={this.state.name.length===0 && this.state.clicked}
            helperText={this.state.name.length===0  && this.state.clicked ? "Required" : ''}
            id="standard-basic"
            label="Item of clothing"
            placeholder={`like "pants"`}
            onChange={(e) => this.setState({ name: e.target.value })}
          />  
        <Typography id="range-slider" gutterBottom>
          Required temperature range:
        </Typography>
        <Slider
          style={{ width: "80%" }}
          onChange={this.handleRequiredChange}
          aria-labelledby="range-slider"
          getAriaValueText={this.valuetext}
          valueLabelFormat={this.valuetext}
          valueLabelDisplay="on"
          marks={marks}
          min={-30}
          max={110}
          defaultValue={[30,70]}
        />
        <Typography id="range-slider" gutterBottom>
          Optional temperature range:
        </Typography>
        <Slider
          style={{ width: "80%" }}
          onChange={this.handleOptionalChange}
          aria-labelledby="range-slider"
          getAriaValueText={this.valuetext}
          valueLabelFormat={this.valuetext}
          valueLabelDisplay="on"
          marks={marks}
          min={-30}
          max={110}
          defaultValue={[30,70]}
        />
      </div>
        <Button onClick={this.handleSubmit}>Add clothes</Button>
      <ShowClothes clothes={this.state.clothes}/>
        </div>
    );

  }
}


