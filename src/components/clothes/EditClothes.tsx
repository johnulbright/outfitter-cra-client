import React from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";

import IconDialog from './IconDialog'
import { marks } from "../../types";
import { ChildKeys } from "../../types";
import { Clothes } from "../../types";
import APIURL from "../../helpers/environment";

const styles = createStyles({
  root: {
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    // border: 0,
    // borderRadius: 3,
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    // color: 'white',
    // height: 48,
    // padding: '0 30px',
  },
  track: {
    color: "red",
    opacity: 1,
  },
  rail: {
    color: "green",
    opacity: 1,
  },
});
interface EditClothesProps extends WithStyles<typeof styles> {
  clothes: Clothes | null;
  child: ChildKeys;
  open: boolean;
  sessionToken: string;
  classes: {
    root: string;
    track: string;
    rail: string;
  };
  getAllClothes: () => void;
  setOpenClothes: (TorF: boolean) => void;
}

interface EditClothesState {
  step0values: number[];
  step1value: number;
  name: string;
  category: string;
  requiredMinTemp: number | null;
  requiredMaxTemp: number | null;
  optionalMinTemp: number | null;
  optionalMaxTemp: number | null;
  minTemp: number;
  maxTemp: number;
  icon: string;
  required: boolean;
  optional: boolean;
  clothes: Clothes[];
  clicked: boolean;
  badName: boolean;
  flipped: boolean;
  tempValue: number | null;
}

class EditClothes extends React.Component<EditClothesProps, EditClothesState> {
  constructor(props: EditClothesProps) {
    super(props);
    this.state = {
      step0values: [30, 70],
      step1value: 40,
      name: "",
      category: "",
      requiredMinTemp: null,
      requiredMaxTemp: null,
      optionalMinTemp: null,
      optionalMaxTemp: null,
      minTemp: 30,
      maxTemp: 70,
      icon: "",
      required: true,
      optional: false,
      clothes: [],
      clicked: false,
      badName: false,
      flipped: true,
      tempValue: null,
    };
  }
  setIcon=(iconString:string):void=>{
    this.setState({icon:iconString})
  }
  handleStep0Change = (event: any, newValue: number | number[]) => {
    this.setState({
      step0values: newValue as number[],
    });
  };
  handleStep1Change = (event: any, newValue: number | number[]): void => {
    this.setState({ step1value: newValue as number });
  };

  handleSubmit = (): void => {
    if (this.props.clothes !== null) {
      this.setState({ clicked: true, badName: this.state.name.length === 0 });
      if(!this.state.badName){
        let oMin, oMax, rMin, rMax: number | null;
        if (!this.state.flipped) {
          if (this.state.step1value === this.state.step0values[0]) {
            rMin = this.state.step0values[0];
            rMax = this.state.maxTemp;
            oMin = null;
            oMax = null;
          } else if (this.state.step1value === this.state.maxTemp) {
            oMin = this.state.step0values[0];
            oMax = this.state.maxTemp;
            rMin = null;
            rMax = null;
          } else {
            oMin = this.state.step0values[0];
            oMax = this.state.step1value;
            rMin = this.state.step1value;
            rMax = this.state.step0values[1];
          }
        } else {
          if (this.state.step1value === this.state.minTemp) {
            oMin = this.state.step0values[0];
            oMax = this.state.step0values[1];
            rMin = null;
            rMax = null;
          } else if (this.state.step1value === this.state.maxTemp) {
            rMin = this.state.step0values[0];
            rMax = this.state.step0values[1];
            oMin = null;
            oMax = null;
          } else {
            rMin = this.state.step0values[0];
            rMax = this.state.step1value;
            oMin = this.state.step1value;
            oMax = this.state.step0values[1];
          }
        }
        this.editClothes(this.props.clothes.id, rMin, rMax, oMin, oMax);
      }
      
    } else {
      console.log("null clothes");
    }
  };
  valuetext(value: number) {
    return `${value}°F`;
  }
  editClothes = async (
    id: number,
    rMin: number | null,
    rMax: number | null,
    oMin: number | null,
    oMax: number | null
  ): Promise<void> => {
    await fetch(`${APIURL}/clothing/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        clothing: {
          name: this.state.name,
          icon: this.state.icon,
          category: this.state.category,
          requiredMin: rMin,
          requiredMax: rMax,
          optionalMin: oMin,
          optionalMax: oMax,
          minTemp: Math.min(...this.state.step0values),
          maxTemp: Math.max(...this.state.step0values),
          step0values: this.state.step0values,
          step1value: this.state.step1value,
          flipped: this.state.flipped,
        },
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    this.props.setOpenClothes(false);
    this.props.getAllClothes();

  };
  getValues = () => {
    console.log("component mounting", this.props.clothes);
    if (this.props.clothes !== null) {
      this.setState({
        step0values: this.props.clothes.step0values,
        step1value: this.props.clothes.step1value,
        flipped: this.props.clothes.flipped,
        name: this.props.clothes.name,
      });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        onEnter={this.getValues}
        onExit={() => {
          this.setState({ name: "" })
          this.props.getAllClothes()
        }}
        fullWidth={true}
        open={this.props.open}
      >
        <div>
          <TextField
            value={this.state.name}
            error={this.state.badName && this.state.clicked}
            helperText={
              this.state.badName && this.state.clicked ? "Required" : ""
            }
            id="standard-basic"
            label="Item of clothing"
            placeholder={`like "pants"`}
            onChange={(e): void =>
              this.setState({
                clicked: false,
                badName: e.target.value.length === 0,
                name: e.target.value,
              })
            }
          
          />
          <IconDialog icon={this.state.icon} setIcon={this.setIcon}/>
          <Typography id="range-slider" gutterBottom>
            In what range of temperatures would {this.props.child.name} wear{" "}
            {this.state.name}?:
          </Typography>
          <Slider
            value={this.state.step0values}
            style={{ width: "80%" }}
            onChange={this.handleStep0Change}
            aria-labelledby="range-slider"
            getAriaValueText={this.valuetext}
            valueLabelFormat={this.valuetext}
            valueLabelDisplay="on"
            marks={marks}
            min={-30}
            max={110}
            defaultValue={[
              this.props.clothes !== null
                ? this.props.clothes.step0values[0]
                : 30,
              this.props.clothes !== null
                ? this.props.clothes.step0values[1]
                : 110,
            ]}
          />
          <Typography id="range-slider" gutterBottom>
            In what ranges should {this.state.name} be{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>required</span>{" "}
            or{" "}
            <span style={{ fontWeight: "bold", color: "green" }}>optional</span>
            ?
          </Typography>
          <Slider
            classes={
              this.state.flipped
                ? {
                    root: classes.root,
                    track: classes.track,
                    rail: classes.rail,
                  }
                : {
                    root: classes.root,
                    track: classes.rail,
                    rail: classes.track,
                  }
            }
            onMouseDown={() =>
              this.setState({ tempValue: this.state.step1value })
            }
            onMouseUp={() => {
              this.state.step1value === this.state.tempValue &&
                this.setState({ flipped: !this.state.flipped });
            }}
            value={this.state.step1value}
            style={{ width: "80%" }}
            onChange={this.handleStep1Change}
            aria-labelledby="range-slider"
            getAriaValueText={this.valuetext}
            valueLabelFormat={this.valuetext}
            valueLabelDisplay="on"
            marks={[
              {
                value: Math.min(...this.state.step0values),
                label: `${Math.min(...this.state.step0values)}°F`,
              },
              {
                value: Math.max(...this.state.step0values),
                label: `${Math.max(...this.state.step0values)}°F`,
              },
            ]}
            min={Math.min(...this.state.step0values)}
            max={Math.max(...this.state.step0values)}
            defaultValue={this.state.step1value}
          />

          <Button onClick={this.handleSubmit}>Submit</Button>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(styles)(EditClothes);
