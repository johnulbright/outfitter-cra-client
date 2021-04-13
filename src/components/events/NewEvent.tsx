import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { KeyboardTimePicker,MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import DateFnsAdapter from "@date-io/date-fns";
import APIURL from "../../helpers/environment.js";

interface NewEventProps {
  sessionToken: string;
  getEvents: () => void;
  child: {
    id: number;
    name: string;
    username: string;
    deviceId?: string;
    parentId: number;
  };
}

interface NewEventState {
  eventName: string;
  eventTime: Date | null;
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

  createEvent = async (hours:number,minutes:number): Promise<void> => {
    const result =await fetch(`${APIURL}/event/create/${this.props.child.id}`, {
      method: "POST",
      body: JSON.stringify({
        event: {
          name: this.state.eventName,
          hours: hours,
          minutes:minutes
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
    });
  };

  handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const dateFns=new DateFnsAdapter();
    const initialDateFnsDate = dateFns.date(this.state.eventTime);
    // const formattedTime=dateFns.format(updatedDateFnsDate,'fullTime24h')
    const hh=dateFns.getHours(initialDateFnsDate)
    const mm=dateFns.getMinutes(initialDateFnsDate)
    console.log(hh,typeof hh)
    console.log(mm,typeof mm)
    // console.log('this',formattedTime)
    this.setState({ clicked: true });
    let ready = !this.state.badName && this.state.eventTime;
    if (ready) {
      this.createEvent(hh,mm);
    }
  };

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
            label="What's happening?"
            onChange={(e) => {
              this.setState({
                eventName: e.target.value,
                badName: e.target.value.length === 0,
              });
            }}
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
             <KeyboardTimePicker
            label="What time?"
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
      </div>
    );
  }
}
