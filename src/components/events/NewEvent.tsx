import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import Paper from "@material-ui/core/Paper";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";

import DateFnsUtils from "@date-io/date-fns";
import DateFnsAdapter from "@date-io/date-fns";
import APIURL from "../../helpers/environment.js";
import { ChildKeys } from "../../types";

const styles = createStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "300px",
    marginTop: "10px",
  },
  paper: {
    display: "flex",
    justifyContent: "center",
    width: "450px",
    padding: "10px",
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
interface NewEventProps extends WithStyles<typeof styles> {
  showCancel: boolean;
  sessionToken: string;
  getEvents: () => void;
  child: ChildKeys;
  setOpenNewEvent: (TorF: boolean) => void;
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

class NewEvent extends React.Component<NewEventProps, NewEventState> {
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

  createEvent = async (hours: number, minutes: number): Promise<void> => {
    const result = await fetch(
      `${APIURL}/event/create/${this.props.child.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          event: {
            name: this.state.eventName,
            hours: hours,
            minutes: minutes,
            eventTime: this.state.eventTime,
          },
        }),
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: this.props.sessionToken,
        }),
      }
    );
    const json = result.json();
    this.props.getEvents();
    this.setState({
      eventName: "",
      eventTime: null,
      clicked: false,
      badName: true,
      badTime: true,
    });
    this.props.setOpenNewEvent(false);
  };
  handleCancel = (e: any): void => {
    e.preventDefault();
    this.props.getEvents();
    this.setState({
      eventName: "",
      eventTime: null,
      clicked: false,
      badName: true,
      badTime: true,
    });
    this.props.setOpenNewEvent(false);
  };
  handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({
      clicked: true,
      badTime:
        this.state.eventTime === undefined || this.state.eventTime === null,
    });

    let ready = !this.state.badName && this.state.eventTime;
    if (ready) {
      const dateFns = new DateFnsAdapter();
      const initialDateFnsDate = dateFns.date(this.state.eventTime);
      const hh = dateFns.getHours(initialDateFnsDate);
      const mm = dateFns.getMinutes(initialDateFnsDate);
      this.createEvent(hh, mm);
    }
  };

  render(): JSX.Element {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <form autoComplete="off">
            <div>
              <Typography align="center" variant="h5">
                Let's add {this.props.showCancel ? "an event" : "some events"}{" "}
                to {this.props.child.name}'s day
              </Typography>
            </div>
            <div>
              <Typography align="center" variant="caption">
                Just list the things that that are impacted by the weather, so
                probably things that happen outside.
              </Typography>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  className={classes.input}
                  label="What time?"
                  error={this.state.badTime && this.state.clicked}
                  helperText={
                    this.state.eventTime === null && this.state.clicked
                      ? "Required"
                      : ""
                  }
                  placeholder="08:00 AM"
                  mask="__:__ _M"
                  value={this.state.eventTime}
                  onChange={(date) => this.setState({ eventTime: date })}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                className={classes.button}
                onClick={(e) => this.handleSubmit(e)}
                type="submit"
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </div>
            {this.props.showCancel && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="text"
                  style={{ color: "#678b4f" }}
                  onClick={(e) => this.handleCancel(e)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(NewEvent);
