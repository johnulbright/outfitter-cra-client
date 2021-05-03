import React from "react";
import BlockOutlined from '@material-ui/icons/BlockOutlined';
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import Pencil from '@material-ui/icons/EditOutlined'
import Icon from './Icon'
import ClothesDictionary,{clothesArray} from './clothesIcons'

const styles = createStyles({
  root: {
    alignItems:'center',
    justifyContent:'center'
  },
  input: {
    width:'300px',
    marginTop:'10px'
  },
  paper: {
    margin:'auto',
    display: "flex",
    justifyContent: "center",
    width: "400px",
  },
  button: {
    marginTop:'10px',
    marginBottom:'10px',
    backgroundColor:'#96bb7c',
    color:'black',
    '&:hover': {
      backgroundColor: '#678b4f',
      color: '#black',
  },
  },
  pencil: {
    // marginTop:'10px',
    // marginBottom:'10px',
    color:'#678b4f',
    '&:hover': {
      color: '#96bb7c',
  },
  },
});

interface IconProps extends WithStyles<typeof styles> {
    setIcon:(iconString:string)=>void;
    icon:string;
    classes: {
      root: string;
      input: string;
      paper: string;
      button: string;
      pencil:string;
    };
  }

interface IconState {
    open:boolean
}
class IconDialog extends React.Component<IconProps, IconState> {
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
  backgroundColor=()=>this.props.icon===''?'#96bb7c':'white';

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div style={{ width:'100%', height:"50px",display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
        <Typography variant='body1'>Selected icon:</Typography>&nbsp;
        {this.props.icon==''?<Typography variant='body1'>none</Typography>:<Icon size={1} key='selectedIcon' isSelected={false} icon={this.props.icon} setIcon={()=>{}}/>}
          <Pencil className={classes.pencil} onClick={this.handleOpen}/>
        </div>
        
          
        <Dialog onClose={this.handleClose} open={this.state.open}>
          <div style={{justifyContent:'center'}}>
            <div style={{display:'flex',justifyContent:'center'}}>
            <Typography variant='h6'>Select an icon for this item of clothing</Typography>

            </div>
            <div style={{display:'flex',margin:'auto',flexWrap:"wrap",justifyContent:'center'}}>
              <BlockOutlined style={{height:'50px',width:'50px',margin:'5px',backgroundColor:`${this.backgroundColor()}`}} onClick={()=>this.props.setIcon('')}/>
        {clothesArray?.map((icon)=>{
            return(
              <Icon size={1} key={`${this.props.icon==icon}${icon}`} isSelected={this.props.icon==icon} icon={icon} setIcon={this.props.setIcon}/>
            )
          })}
            </div>
            
          </div>
          <div style={{display:'flex',justifyContent:'center'}}>
          
          <Button className={classes.button} onClick={this.handleClose}>Close</Button>
          </div>
            <div style={{margin:'5px'}}>
              <Typography variant='caption'>
              Icons made by{" "}
          <a
            style={{color:'#678b4f',textDecoration:'none'}}
            href="https://www.flaticon.com/authors/good-ware"
            title="Good Ware"
          >
            Good Ware
          </a>{", "}
          
          <a style={{color:'#678b4f',textDecoration:'none'}} href="https://www.flaticon.com/authors/itim2101" title="itim2101">
            itim2101
          </a>{", "}
          <a
            style={{color:'#678b4f',textDecoration:'none'}}
            href="https://www.flaticon.com/authors/neungstockr"
            title="neungstockr"
          >
            neungstockr
          </a>{", "}
          <a 
          style={{color:'#678b4f',textDecoration:'none'}}
          href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{", "}
          <a style={{color:'#678b4f',textDecoration:'none'}}
            href="https://www.flaticon.com/authors/smashicons"
            title="Smashicons"
          >
            Smashicons
          </a>{", "}
          <a style={{color:'#678b4f',textDecoration:'none'}}
            href="https://www.flaticon.com/authors/nhor-phai"
            title="Nhor Phai"
          >
            Nhor Phai
          </a>{", "}
          <a style={{color:'#678b4f',textDecoration:'none'}}
            href="https://www.flaticon.com/authors/ultimatearm"
            title="ultimatearm"
          >
            ultimatearm
          </a>{", "}
          <a style={{color:'#678b4f',textDecoration:'none'}}
            href="https://www.flaticon.com/authors/icongeek26"
            title="Icongeek26"
          >
            Icongeek26
          </a>{" "}
          <a style={{color:'#678b4f',textDecoration:'none'}} href="https://www.flaticon.com/authors/iconixar" title="iconixar">
            iconixar
          </a>{", "}
          <a style={{color:'#678b4f',textDecoration:'none'}}
            href="https://www.flaticon.com/authors/dinosoftlabs"
            title="DinosoftLabs"
          >
            DinosoftLabs
          </a>{", and "}
          <a style={{color:'#678b4f',textDecoration:'none'}} href="https://www.flaticon.com/authors/bqlqn" title="bqlqn">
            bqlqn
          </a>{" "}
          from{" "}
          <a style={{color:'#678b4f',textDecoration:'none'}} href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
              </Typography>
          
        </div>
      </Dialog>
      </div>
    );
  }
}
export default withStyles(styles)(IconDialog);
