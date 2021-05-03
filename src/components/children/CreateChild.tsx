import React from "react";
import {Link} from "react-router-dom";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import {ChildKeys} from '../../types'
import NewChild from "./NewChild";
import EventIndex from "../events/EventIndex";
import NewClothes from '../clothes/NewClothes'
import APIURL from '../../helpers/environment'
import outfitterLogo from '../../assets/outfitter-logo.png'

const styles = createStyles({
  appBar: {
      backgroundColor: "#eebb4d",
      height: 70,

      width: "100%",
      marginLeft: "0px",
  },

  paper:{

  },
  button:{
    marginTop: "10px",
    marginBottom: "10px",
    backgroundColor: "#96bb7c",
    color: "black",
    "&:hover": {
      backgroundColor: "#678b4f",
      color: "#black",
    },
  },

  logoutButton: {
    // margin:'70vw',
    // color:'pink',
},
})

interface CreateChildProps extends WithStyles<typeof styles> {
  sessionToken: string;
  getMyChildren: () => void;
  clearToken: () => void;

  classes: {
    appBar:string;
    paper: string;
    button: string;
    logoutButton:string;
   
}
}

interface CreateChildState {
  activeStep: number;
  open: boolean;
  child: ChildKeys;
  submitted:boolean;
}

class CreateChild extends React.Component<CreateChildProps,CreateChildState> {
  constructor(props: CreateChildProps) {
    super(props);
    this.state = {
      submitted:false,
      activeStep: 0,
      open: false,
      child: {
        id: null,
        name: null,
        username: null,
        parentId: null,
        underwearRemind:false
      },
    };
    this.setChild=this.setChild.bind(this)
    this.deleteChild=this.deleteChild.bind(this)
    this.handleClose=this.handleClose.bind(this)
    this.handleFinish=this.handleFinish.bind(this)
    
  }
  deleteChild=async():Promise<void>=>{
    await fetch(`${APIURL}/child/delete/${this.state.child.id}`, {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: this.props.sessionToken,
        }),
      });
    this.props.getMyChildren();

    }
  
  setChild(childObject: ChildKeys): void {
    this.setState({ child: childObject });
  }
  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  handleReset = () => {
    this.setState({ activeStep: 0 });
  };
  getSteps() {
    return ["Name", "Events", "Clothing"];
  }

  getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return (
          <NewChild
            sessionToken={this.props.sessionToken}
            handleNext={this.handleNext}
            setChild={this.setChild}
          />
        );
      case 1:
        return (
          <EventIndex showEdit={false}
            sessionToken={this.props.sessionToken}
            child={this.state.child}
          />
        );
      case 2:
        return <NewClothes getAllClothes={()=>{}} closeNewClothes={()=>{}} showClothes={true} sessionToken={this.props.sessionToken} child = {this.state.child}/>;
      default:
        return "Unknown stepIndex";
    }
  }

  handleOpen = ():void => {
    this.setState({ open: true, activeStep: 0 ,submitted:false});
  };

  handleClose = ():void => {
    console.log('close and submitted state',this.state.submitted)
    if (!this.state.submitted&&this.state.activeStep>0){
      this.deleteChild();
      console.log(this.state.child.name,"deleted")
    }
    this.setState({ open: false, activeStep: 0 });
    this.props.getMyChildren();
  };
  handleFinish=():void=>{
    this.setState({submitted:true},this.handleClose)
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div>
         <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>

                        <img style={{ width: '135px' }} src={outfitterLogo} alt='outfitter logo' />
                        <Button className={classes.logoutButton} onClick={this.props.clearToken}>Logout</Button>
                    </Toolbar>
                </AppBar>
      <div style={{marginTop:'100px',width:'400px'}}>
        <Paper>
        <Stepper activeStep={this.state.activeStep} alternativeLabel>
            {this.getSteps().map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
          
          <div>
            {this.state.activeStep === this.getSteps().length ? (
              <div>
                <Typography>All steps completed</Typography>
                <Button className={classes.button} onClick={this.handleReset}>Reset</Button>
              </div>
            ) : (
              <div style={{marginTop:"20px"}}>
                  {this.getStepContent(this.state.activeStep)}
                <div>
                {this.state.activeStep===1&&
                  <Button className={classes.button} variant="contained" color="primary" onClick={this.handleNext}>Next</Button>
                  }
                </div>
                <div>
                <Link style={{color: "#678b4f",textDecoration:'none'}} to="/"><Button onClick={this.handleClose}>Cancel</Button></Link>
                </div>
                  
                 
                  {this.state.activeStep===2&&
                  <div>
                     <Link to="/">
                    <Button className={classes.button} variant="contained" color="primary" onClick={this.handleFinish}>Finish</Button>
                    </Link>
                  </div>
                 
                  }
                
              </div>
            )}
          </div>
      </div>
      </div>

    );
  }
}

export default withStyles(styles)(CreateChild);