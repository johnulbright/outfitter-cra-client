import React from 'react'
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { createStyles,WithStyles,withStyles } from '@material-ui/styles';


import {marks} from '../../types'
import {ChildKeys} from '../../types'
import {Clothes} from '../../types'
import APIURL from '../../helpers/environment'
import ShowClothes from './ShowClothes'

const styles0 = createStyles({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    // border: 0,
    // borderRadius: 3,
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    // color: 'white',
    // height: 48,
    // padding: '0 30px',
  },
  track:{
    color:'red',
    opacity:1
  },
  rail:{
    color:'green',
    opacity:1
  }
})
interface NewClothesProps extends WithStyles<typeof styles0>{
  child:ChildKeys
  sessionToken:string
  classes:{
    root:string;
    track:string;
    rail:string
  }
}

interface NewClothesState {
  step0values: number[];
  step1value:number;
  name:string;
  category:string;
  requiredMinTemp:number|null;
  requiredMaxTemp:number|null;
  optionalMinTemp:number|null;
  optionalMaxTemp:number|null;
  minTemp:number;
  maxTemp:number;
  icon:string;
  clothes:Clothes[];
  clicked:boolean;
  step:number;
  badName:boolean;
  flipped:boolean;
  tempValue:number|null
}

type NewType = Promise<void>;

class NewClothes extends React.Component<NewClothesProps, NewClothesState>{
  constructor(props: NewClothesProps) {
    super(props)
    this.state = {
      step0values:[30,70],
      step1value:40,
      name:'',
      category:'',
      requiredMinTemp:null,
      requiredMaxTemp:null,
      optionalMinTemp:null,
      optionalMaxTemp:null,
      minTemp:30,
      maxTemp:70,
      icon:'',
      clothes:[],
      clicked:false,
      step:0,
      badName:false,
      flipped:true,
      tempValue:null
    }
  }
   
  handleStep0Change = (event: any, newValue: number|number[]) => {
    this.setState({step0values:newValue as number[]});
  };
  handleStep1Change = (event: any, newValue: number|number[]): void => {
    this.setState({step1value:newValue as number});
  };

  handleSubmit=():void=>{

    this.setState({clicked:true,badName:this.state.name.length===0})
    switch (this.state.step){
      case 0:
        this.setState({
          clicked:false,
          minTemp:Math.min(...this.state.step0values),
          maxTemp:Math.max(...this.state.step0values),
          step1value:Math.round((Math.min(...this.state.step0values)+Math.max(...this.state.step0values))/2),
          step:1,
        })
        break;
      case 1:
        let oMin,oMax,rMin,rMax:number|null;
        if(!this.state.flipped){
          if(this.state.step1value===this.state.minTemp){
              rMin=this.state.minTemp;
              rMax=this.state.maxTemp;
              oMin=null;
              oMax=null;
            } else if (this.state.step1value===this.state.maxTemp){
              oMin=this.state.minTemp;
              oMax=this.state.maxTemp;
              rMin=null;
              rMax=null;
            } else {
              oMin=this.state.minTemp;
              oMax=this.state.step1value;
              rMin=this.state.step1value;
              rMax=this.state.maxTemp;
            }
        } else {
          if(this.state.step1value===this.state.minTemp){
            oMin=this.state.minTemp;
            oMax=this.state.maxTemp;
            rMin=null;
            rMax=null;
          } else if (this.state.step1value===this.state.maxTemp){
            rMin=this.state.minTemp;
            rMax=this.state.maxTemp;
            oMin=null;
            oMax=null;
          } else {
            rMin=this.state.minTemp;
            rMax=this.state.step1value;
            oMin=this.state.step1value;
            oMax=this.state.maxTemp;
          }
        }
        this.addClothes(rMin,rMax,oMin,oMax)
        this.setState({
          name:'',
          clicked:false,
          step:0,
          category:'',
          icon:'',
          step0values:[30,70],
          step1value:40
        })
        break;
      default: break;
    }     
  }
  valuetext(value: number) {
    return `${value}°F`;
  }
  addClothes=async(rMin:number|null,rMax:number|null,oMin:number|null,oMax:number|null): Promise<void>=>{
    await fetch(`${APIURL}/clothing/create/${this.props.child.id}`,{
      method: "POST",
      body: JSON.stringify({
        clothing: {
          name: this.state.name,
          icon: this.state.icon,
          category: this.state.category,
          requiredMin:rMin,
          requiredMax:rMax,
          optionalMin:oMin,
          optionalMax:oMax,
          minTemp:this.state.minTemp,
          maxTemp:this.state.maxTemp,
          step0values:this.state.step0values,
          step1value:this.state.step1value,
          flipped:this.state.flipped,
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
    const { classes } = this.props;
    return (
      <div>
        <div>
        <TextField
            error={this.state.badName&& this.state.clicked}
            helperText={this.state.badName && this.state.clicked ? "Required" : ''}
            id="standard-basic"
            label="Item of clothing"
            placeholder={`like "pants"`}
            onChange={(e): void => this.setState({clicked:false,badName:e.target.value.length===0,name: e.target.value })}
          />  
        {this.state.step===0?
          (<div>
            <Typography id="range-slider" gutterBottom>
            In what range of temperatures would {this.props.child.name} wear {this.state.name}?:
          </Typography>
          <Slider
            value={this.state.step0values}
            style={{ width: "80%" }}
            onChange={this.handleStep0Change}
            aria-labelledby="range-slider"
            getAriaValueText={this.valuetext}
            valueLabelFormat={this.valuetext}
            valueLabelDisplay="on"
            marks={marks}
            min={-30}
            max={110}
            defaultValue={[30,70]}
          />
          </div>):(
            <div>
          <Typography id="range-slider" gutterBottom>
            In what ranges should {this.state.name} be <span style={{fontWeight:"bold",color:"red"}}>required</span> or <span style={{fontWeight:"bold",color:"green"}}>optional</span>?:
          </Typography>
          <Slider
           classes={this.state.flipped?{root: classes.root,track: classes.track,rail:classes.rail}:{root: classes.root,track: classes.rail,rail:classes.track}}
            onMouseDown={()=>this.setState({tempValue:this.state.step1value})}
            onMouseUp={()=>{this.state.step1value===this.state.tempValue&&this.setState({flipped:!this.state.flipped})}}
            value={this.state.step1value}
            style={{ width: "80%"}}
            onChange={this.handleStep1Change}
            aria-labelledby="range-slider"
            getAriaValueText={this.valuetext}
            valueLabelFormat={this.valuetext}
            valueLabelDisplay="on"
            marks={[{value: this.state.minTemp,label: `${this.state.minTemp}°F`},{value: this.state.maxTemp,label: `${this.state.maxTemp}°F`}]}
            min={this.state.minTemp}
            max={this.state.maxTemp}
            // defaultValue={}
          />
          </div>)
        }
      </div>
        <Button onClick={this.handleSubmit}>{this.state.step==0?"Next":"Add clothes"}</Button>
      {this.state.clothes.length>0&&<ShowClothes setActiveClothes={()=>{}} setOpenClothes={()=>{}} delete={false} child={this.props.child} getAllClothes={this.getAllClothes} sessionToken={this.props.sessionToken} clothes={this.state.clothes}/>}
      
        </div>
    );

  }
}


export default withStyles(styles0)(NewClothes);