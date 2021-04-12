import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import TimePicker from '@material-ui/lab/TimePicker';


import APIURL from "../../helpers/environment.js";

interface NewEventProps {
  sessionToken: string;
  getEvents: () => void;
  child:{
    id:number,
    name:string,
    username:string,
    deviceId?:string,
    parentId:number,
};
  }

interface NewEventState {
  eventName: string;
  eventTime: Date|null;
  badName: boolean;
  badTime: boolean;
  clicked: boolean;
}

export default class NewEvent extends React.Component<
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

  createEvent = async (): Promise<void> => {
    const result = await fetch(`${APIURL}/event/${this.props.child.id}`, {
      method: "POST",
      body: JSON.stringify({
        event: {
          name: this.state.eventName,
          time: this.state.eventTime,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    this.props.getEvents();
    this.setState({
      eventName: "",
      eventTime: null,
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.setState({ clicked: true });
    let ready = !this.state.badName && !this.state.badTime;
    if (ready) {
      this.createEvent();
      };
    }

  render(): JSX.Element {
    return (
      <div>
        <h1>New event</h1>
        <form autoComplete="off">
          <TextField
            value={this.state.eventName}
            error={this.state.badName && this.state.clicked}
            helperText={
              this.state.badName && this.state.clicked ? "Required" : ""
            }
            label="Name"
            onChange={(e) => {
              this.setState({
                eventName: e.target.value,
                badName: e.target.value.length === 0,
              });
            }}
          />
           <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label="Basic example"
        value={this.state.eventTime}
        onChange={(time:Date) => {
          this.setState({eventTime:time});
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>

          <Button
            onClick={(e) => this.handleSubmit(e)}
            type="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
}
