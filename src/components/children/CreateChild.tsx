import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import Dialog from "@material-ui/core/Dialog";

import {ChildKeys} from '../../types'
import NewChild from "./NewChild";
import EventIndex from "../events/EventIndex";
import NewClothes from '../clothes/NewClothes'
import APIURL from '../../helpers/environment'

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     root: {
//       width: '100%',
//     },
//     backButton: {
//       marginRight: theme.spacing(1),
//     },
//     instructions: {
//       marginTop: theme.spacing(1),
//       marginBottom: theme.spacing(1),
//     },
//   }),
// );

interface CreateChildProps {
  sessionToken: string;
  getMyChildren: () => void;
  getAllUsernames: () => void;
  takenUsernames: string[];
}
// interface ChildObjectState {
//   id: number | null;
//   name: string | null;
//   username: string | null;
//   deviceId?: string;
//   parentId: number | null;
// }
interface CreateChildState {
  activeStep: number;
  open: boolean;
  child: ChildKeys;
  submitted:boolean;
}

export default class CreateChild extends React.Component<CreateChildProps,CreateChildState> {
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
            takenUsernames={this.props.takenUsernames}
            getAllUsernames={this.props.getAllUsernames}
            handleNext={this.handleNext}
            setChild={this.setChild}
          />
        );
      case 1:
        return (
          <EventIndex
            sessionToken={this.props.sessionToken}
            child={this.state.child}
          />
        );
      case 2:
        return <NewClothes sessionToken={this.props.sessionToken} child = {this.state.child}/>;
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
    console.log('end of handle close')

  };
  handleFinish=():void=>{
    this.setState({submitted:true},this.handleClose)
  }
  render() {
    return (
      <div>
        <PersonAddOutlinedIcon type="button" onClick={this.handleOpen} />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          // style={{padding:"50px"}}
          fullScreen={true}
        >
          <Stepper activeStep={this.state.activeStep} alternativeLabel>
            {this.getSteps().map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <div>
            {this.state.activeStep === this.getSteps().length ? (
              <div>
                <Typography>All steps completed</Typography>
                <Button onClick={this.handleReset}>Reset</Button>
              </div>
            ) : (
              <div style={{margin:"20px"}}>
                  {this.getStepContent(this.state.activeStep)}
                
                  <Button
                    onClick={this.handleClose}
                  >
                    Cancel
                </Button>
                  {this.state.activeStep>=1&&<Button
                    variant="contained"
                    color="primary"
                    onClick={this.state.activeStep===1?this.handleNext:this.handleFinish}
                  >
                    {this.state.activeStep === 1
                      ? "Next"
                      : "Finish"}
                  </Button>}
                
              </div>
            )}
          </div>
        </Dialog>
      </div>
    );
  }
}
