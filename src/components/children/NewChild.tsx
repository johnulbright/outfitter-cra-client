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
});
interface NewChildProps  extends WithStyles<typeof styles> {
  sessionToken: string;
  handleNext: () => void;
  setChild: (child:ChildKeys) => void;
  getAllUsernames: () => void;
  takenUsernames: string[];
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
}

class NewChild extends React.Component<
  NewChildProps,
  NewChildState
> {
  constructor(props: NewChildProps) {
    super(props);
    this.state = {
      name: "",
      username: "",
      deviceId: "",
      underwearRemind: false,
      badName: true,
      badUsername: true,
      clicked: false,
    };
    this.createChild = this.createChild.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goodUsername = this.goodUsername.bind(this);
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
    const child=await result.json()
    this.props.setChild(child.result)
    this.props.getAllUsernames();
    this.setState({
      name: "",
      username: "",
      underwearRemind: false,
      clicked: false,
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ clicked: true });
    let ready = !this.state.badName && !this.state.badUsername;
    if (ready) {
      this.createChild();
      this.props.handleNext();
    }
  };

  goodUsername(text: string): boolean {
    let unique = true;
    this.props.takenUsernames?.map((i: string): void => {
      if (i === text) {
        unique = false;
      }
    });
    return unique;
  }
 
  render(): JSX.Element {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
      <Paper className={classes.paper}>
       
        <form autoComplete="off">
        <div>
        <Typography variant="h4">New child</Typography>

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
            error={this.state.badUsername && this.state.clicked}
            helperText={
              this.state.badUsername && this.state.clicked
                ? "Username is not available"
                : ""
            }
            label="Username"
            defaultValue=""
            onChange={(e): void => {
              this.setState({
                username: e.target.value,
                badUsername: !this.goodUsername(e.target.value),
              });
            }}
          />
         </div>
          <div>
          <FormControlLabel
          style={{marginTop:"20px",marginBottom:"05px"}}
            control={
              <Checkbox
              
                checked={this.state.underwearRemind}
                color="primary"
                inputProps={{ "aria-label": "secondary checkbox" }}
                onChange={(event): void =>
                  {
                    return this.setState({ underwearRemind: event.target.checked });
                  }
                }
              />
            }
            label="Remind to change underwear"
          />
          </div>
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

         
        </form>
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(NewChild);
