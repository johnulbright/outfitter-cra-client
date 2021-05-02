import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { KeyboardTimePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import Paper from "@material-ui/core/Paper";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";

import DateFnsUtils from '@date-io/date-fns';
import DateFnsAdapter from "@date-io/date-fns";
import APIURL from "../../helpers/environment.js";
import {ChildKeys} from '../../types'

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
interface NewEventProps extends WithStyles<typeof styles> {
  sessionToken: string;
  getEvents: () => void;
  child: ChildKeys;
  setOpenNewEvent:(TorF:boolean)=>void;
  classes: {
    root: string;
    input: string;
    paper: string;
    button: string;
  };
}

interface NewEventState {
  eventName: string;
  eventTime: Date | null;
  badName: boolean;
  badTime: boolean;
  clicked: boolean;
}

class NewEvent extends React.Component<
  NewEventProps,
  NewEventState
> {
  constructor(props: NewEventProps) {
    super(props);
    this.state = {
      eventName: "",
      eventTime: null,
      badName: true,
      badTime: true,
      clicked: false,
    };
  }

  createEvent = async (hours:number,minutes:number): Promise<void> => {
    console.log(this.props.child)
    const result =await fetch(`${APIURL}/event/create/${this.props.child.id}`, {
      method: "POST",
      body: JSON.stringify({
        event: {
          name: this.state.eventName,
          hours: hours,
          minutes:minutes,
          eventTime:this.state.eventTime,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        "Authorization": this.props.sessionToken,
      }),
    });
    const json=result.json()
    console.log(json)
    this.props.getEvents();
    this.setState({
      eventName: "",
      eventTime: null,
      clicked:false
    });
    this.props.setOpenNewEvent(false);
  };

  handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ clicked: true,badTime:this.state.eventTime===undefined||this.state.eventTime===null});
    
    console.log(this.state.badName,this.state.badTime,this.state.clicked)
    let ready = !this.state.badName && this.state.eventTime;
    if (ready) {
      console.log('create')
      const dateFns=new DateFnsAdapter();
    const initialDateFnsDate = dateFns.date(this.state.eventTime);
    const hh=dateFns.getHours(initialDateFnsDate)
    const mm=dateFns.getMinutes(initialDateFnsDate)
      this.createEvent(hh,mm);
    }
  };

  render(): JSX.Element {
    const { classes } = this.props;

    return (
      <div>
        <Paper>
        
      
        <form autoComplete="off">
        <div>
              <Typography variant='body1'>
          Enter the events that take place outside for your child 
        </Typography>
          </div>
          <div>
          <TextField
          className={classes.input}

            value={this.state.eventName}
            error={this.state.badName && this.state.clicked}
            helperText={
              this.state.badName && this.state.clicked ? "Required" : ""
            }
            label="What's happening?"
            onChange={(e) => {
              this.setState({
                eventName: e.target.value,
                badName: e.target.value.length === 0,
              });
            }}
          />
          </div>
          
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
             <KeyboardTimePicker
            label="What time?"
            error={this.state.badTime&&this.state.clicked}
            helperText={
              this.state.eventTime===null && this.state.clicked ? "Required" : ""
            }
            placeholder="08:00 AM"
            mask="__:__ _M"
            value={this.state.eventTime}
            onChange={(date) => this.setState({ eventTime: date })}
          />
          </MuiPickersUtilsProvider>
         

          <Button
            onClick={(e) => this.handleSubmit(e)}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </form>
        </Paper>
       
      </div>
    );
  }
}
export default withStyles(styles)(NewEvent);