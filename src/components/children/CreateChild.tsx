import React from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import Dialog from "@material-ui/core/Dialog";

import NewChild from "./NewChild";
import EventIndex from "../events/EventIndex";

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
interface ChildObjectState {
  id: number | null;
  name: string | null;
  username: string | null;
  deviceId?: string;
  parentId: number | null;
}
interface CreateChildState {
  activeStep: number;
  open: boolean;
  child: ChildObjectState;
}

export default class CreateChild extends React.Component<
  CreateChildProps,
  CreateChildState
> {
  constructor(props: CreateChildProps) {
    super(props);
    this.state = {
      activeStep: 0,
      open: false,
      child: {
        id: null,
        name: null,
        username: null,
        parentId: null,
      },
    };
  }
  setChild(childObject: ChildObjectState): void {
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
            getMyChildren={this.props.getMyChildren}
            takenUsernames={this.props.takenUsernames}
            getAllUsernames={this.props.getAllUsernames}
            handleNext={this.handleNext}
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
        return "This is the bit I really care about!";
      default:
        return "Unknown stepIndex";
    }
  }

  handleOpen = () => {
    this.setState({ open: true, activeStep: 0 });
  };

  handleClose = () => {
    this.setState({ open: false, activeStep: 0 });
  };

  render() {
    return (
      <div>
        <PersonAddOutlinedIcon type="button" onClick={this.handleOpen} />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
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
              <div>
                <Typography>
                  {this.getStepContent(this.state.activeStep)}
                </Typography>
                <div>
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={this.handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                  >
                    {this.state.activeStep === this.getSteps().length - 1
                      ? "Finish"
                      : "Next"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      </div>
    );
  }
}
