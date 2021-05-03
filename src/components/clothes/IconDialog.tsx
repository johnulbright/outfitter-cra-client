import React from "react";
import BlockOutlined from '@material-ui/icons/BlockOutlined';

import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'

import Icon from './Icon'
import ClothesDictionary,{clothesArray} from './clothesIcons'

interface IconProps {
    setIcon:(iconString:string)=>void;
    icon:string;
}

interface IconState {
    open:boolean
}
export default class IconDialog extends React.Component<IconProps, IconState> {
  constructor(props: IconProps) {
    super(props);
    this.state = {
        open:false
    };
  }
  handleOpen=()=>{
      this.setState({open:true})
  }
  handleClose=()=>{
      this.setState({open:false})
      console.log(this.props.icon)
  }
  backgroundColor=()=>this.props.icon===''?'#ffa000':'white';
  // backgroundColor=()=>this.props.icon===''?'blue':'none';

  render() {
    return (
      <div >
          <Button onClick={this.handleOpen}>Add/Change Icon</Button>
      
        <Dialog onClose={this.handleClose} open={this.state.open}>
          <Button onClick={this.handleClose}>Close</Button>
          <div style={{flexWrap:"wrap"}}>
          {/* <BlockOutlined style={{backgroundColor:'red'}}onClick={()=>this.props.setIcon('')}/> */}
            <BlockOutlined style={{height:'50px',width:'50px',margin:'5px',backgroundColor:`${this.backgroundColor()}`}} onClick={()=>this.props.setIcon('')}/>
        {clothesArray?.map((icon)=>{
            return(
              <Icon size={1} key={`${this.props.icon==icon}${icon}`} isSelected={this.props.icon==icon} icon={icon} setIcon={this.props.setIcon}/>
            )
          })}
          </div>
            <div>
          Icons made by{" "}
          <a
            href="https://www.flaticon.com/authors/good-ware"
            title="Good Ware"
          >
            Good Ware
          </a>{" "}
          
          <a href="https://www.flaticon.com/authors/itim2101" title="itim2101">
            itim2101
          </a>{" "}
          <a
            href="https://www.flaticon.com/authors/neungstockr"
            title="neungstockr"
          >
            neungstockr
          </a>{" "}
          <a href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{" "}
          <a
            href="https://www.flaticon.com/authors/smashicons"
            title="Smashicons"
          >
            Smashicons
          </a>{" "}
          <a
            href="https://www.flaticon.com/authors/nhor-phai"
            title="Nhor Phai"
          >
            Nhor Phai
          </a>{" "}
          <a
            href="https://www.flaticon.com/authors/ultimatearm"
            title="ultimatearm"
          >
            ultimatearm
          </a>{" "}
          <a
            href="https://www.flaticon.com/authors/icongeek26"
            title="Icongeek26"
          >
            Icongeek26
          </a>{" "}
          <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">
            iconixar
          </a>{" "}
          <a
            href="https://www.flaticon.com/authors/dinosoftlabs"
            title="DinosoftLabs"
          >
            DinosoftLabs
          </a>{" "}
          <a href="https://www.flaticon.com/authors/bqlqn" title="bqlqn">
            bqlqn
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </Dialog>
      </div>
    );
  }
}
