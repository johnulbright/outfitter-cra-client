import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import Paper from "@material-ui/core/Paper";
import APIURL from "../../helpers/environment.js";
import { ChildKeys } from "../../types.js";

const styles = createStyles({
  root: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "300px",
    marginTop: "10px",
  },
  paper: {
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    width: "400px",
  },
  button: {
    marginTop: "10px",
    marginBottom: "10px",
    backgroundColor: "#96bb7c",
    color: "black",
    "&:hover": {
      backgroundColor: "#678b4f",
      color: "#black",
    },
  },
});
interface NewChildProps extends WithStyles<typeof styles> {
  sessionToken: string;
  handleNext: () => void;
  setChild: (child: ChildKeys) => void;
  classes: {
    root: string;
    input: string;
    paper: string;
    button: string;
  };
}

interface NewChildState {
  name: string;
  username: string;
  deviceId: string;
  underwearRemind: boolean;
  badName: boolean;
  badUsername: boolean;
  clicked: boolean;
  noUsername:boolean;
}

class NewChild extends React.Component<NewChildProps, NewChildState> {
  constructor(props: NewChildProps) {
    super(props);
    this.state = {
      name: "",
      username: "",
      deviceId: "",
      underwearRemind: false,
      badName: true,
      badUsername: false,
      clicked: false,
      noUsername:true,
    };
    this.createChild = this.createChild.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  createChild = async (): Promise<void> => {
    const result = await fetch(`${APIURL}/child/create`, {
      method: "POST",
      body: JSON.stringify({
        child: {
          name: this.state.name,
          username: this.state.username,
          underwearRemind: this.state.underwearRemind,
          deviceId: this.state.deviceId,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    const child = await result.json();
    console.log('child',child);
    if(child.error){
      if(child.error.name==="SequelizeUniqueConstraintError"){
        this.setState({badUsername:true})
      }
    } else{
      this.props.setChild(child.result)
      this.props.handleNext();

      // this.setState({
      //   name: "",
      //   username: "",
      //   underwearRemind: false,
      //   clicked: false,
      // });
    }
  };

  handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ clicked: true });
    let ready = !this.state.badName&&!this.state.noUsername
    if (ready) {
      this.createChild();
    }
  };
  usernameHelperText=()=>{
    if(this.state.clicked){
      if(this.state.noUsername){
        return 'Required'
      } else if (this.state.badUsername){
        return 'Username not available'
      } else {
        return ''
      }
    } else {
      return ''
    }
  }
  render(): JSX.Element {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <form autoComplete="off">
            <div>
              <Typography variant="h5">New child</Typography>
            </div>
            <div>
              <TextField
                className={classes.input}
                value={this.state.name}
                error={this.state.badName && this.state.clicked}
                helperText={
                  this.state.badName && this.state.clicked ? "Required" : ""
                }
                label="Name"
                onChange={(e) => {
                  this.setState({
                    name: e.target.value,
                    badName: e.target.value.length === 0,
                  });
                }}
              />
            </div>
            <div>
              <TextField
                className={classes.input}
                value={this.state.username}
                error={(this.state.badUsername||this.state.noUsername) && this.state.clicked}
                helperText={this.usernameHelperText()}
                label="Username"
                defaultValue=""
                onChange={(e): void => {
                  this.setState({
                    username: e.target.value,
                    noUsername:e.target.value.length===0
                  });
                }}
              />
            </div>
            <div>
              <FormControlLabel
                style={{ marginTop: "20px", marginBottom: "05px" }}
                control={
                  <Checkbox
                    checked={this.state.underwearRemind}
                    color="primary"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                    onChange={(event): void => {
                      return this.setState({
                        underwearRemind: event.target.checked,
                      });
                    }}
                  />
                }
                label="Remind to change underwear"
              />
            </div>
            
          </form>
        </Paper>
        <div>
              <Button
                className={classes.button}
                onClick={(e) => this.handleSubmit(e)}
                type="submit"
                variant="contained"
                color="primary"
              >
                Next
              </Button>
            </div>
      </div>
    );
  }
}
export default withStyles(styles)(NewChild);
