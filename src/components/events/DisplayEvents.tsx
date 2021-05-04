import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import Delete from "@material-ui/icons/DeleteOutline";
import Pencil from "@material-ui/icons/EditOutlined";
import DateFnsUtils from "@date-io/date-fns";
import DateFnsAdapter from "@date-io/date-fns";
import Container from "@material-ui/core/Container";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";

import { ChildKeys, Event } from "../../types";
import APIURL from "../../helpers/environment";

const styles = createStyles({
  icon: {
    color: "#678b4f",
    "&:hover": {
      color: "#96bb7c",
      cursor: "pointer",
    },
  },
});

interface DisplayEventsProps extends WithStyles<typeof styles> {
  child: ChildKeys;
  events: Event[];
  showEdit: boolean;
  sessionToken: string;
  getEvents: () => void;
  classes: {
    icon: string;
  };
}

interface DisplayEventsState {
  activeEvent: Event | null;
  openEditDialog: boolean;
  eventName: string;
  eventTime: Date | null;
  badName: boolean;
  badTime: boolean;
  clicked: boolean;
}

class DisplayEvents extends React.Component<
  DisplayEventsProps,
  DisplayEventsState
> {
  constructor(props: DisplayEventsProps) {
    super(props);
    this.state = {
      openEditDialog: false,
      activeEvent: null,
      eventName: "",
      eventTime: null,
      badName: false,
      badTime: true,
      clicked: false,
    };
  }
  handlePencilClick = (e: any, event: Event): void => {
    e.preventDefault();
    this.setState({ activeEvent: event, openEditDialog: true });
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
      this.editEvent(hh, mm);
    }
  };
  editEvent = async (hours: number, minutes: number): Promise<void> => {
    if (this.state.activeEvent !== null) {
      const result = await fetch(
        `${APIURL}/event/edit/${this.state.activeEvent.id}`,
        {
          method: "PUT",
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
      });
      this.setState({ openEditDialog: false });
      this.props.getEvents();
    }
  };
  deleteEvent = async (event: any, id: number): Promise<void> => {
    event.preventDefault();
    await fetch(`${APIURL}/event/delete/${id}`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    this.props.getEvents();
  };
  getValues = (): void => {
    if (this.state.activeEvent !== null) {
      this.setState({
        eventName: this.state.activeEvent.name,
        eventTime: this.state.activeEvent.eventTime,
      });
    }
  };
  clearValues = () => {
    this.setState({
      openEditDialog: false,
      activeEvent: null,
      eventName: "",
      eventTime: null,
      badName: true,
      badTime: true,
      clicked: false,
    });
  };
  render() {
    const { classes } = this.props;

    return (
      <div>
        <TableContainer
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Time</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.events?.map((event) => {
                let displayHours: number;
                let displayMinutes: string =
                  event.minutes < 10 ? `0${event.minutes}` : `${event.minutes}`;
                let AorP: string;
                if (event.hours === 0) {
                  displayHours = 12;
                  AorP = "A";
                } else if (event.hours > 12) {
                  displayHours = event.hours - 12;
                  AorP = "P";
                } else if (event.hours === 12) {
                  displayHours = 12;
                  AorP = "P";
                } else {
                  displayHours = event.hours;
                  AorP = "A";
                }
                return (
                  <TableRow>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>
                      {displayHours}:{displayMinutes} {AorP}M
                    </TableCell>
                    {this.props.showEdit && (
                      <TableCell>
                        <Pencil
                          className={classes.icon}
                          onClick={(e) => this.handlePencilClick(e, event)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Delete
                        className={classes.icon}
                        onClick={(e) => this.deleteEvent(e, event.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          onEnter={this.getValues}
          onExit={this.clearValues}
          open={this.state.openEditDialog}
        >
          <form autoComplete="off">
            <Container>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <TextField
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <Button
                  onClick={(e) => this.handleSubmit(e)}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </div>
            </Container>
          </form>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(DisplayEvents);
