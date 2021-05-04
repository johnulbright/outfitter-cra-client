import React from "react";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";

import { marks } from "../../types";
import { ChildKeys } from "../../types";
import { Clothes } from "../../types";
import APIURL from "../../helpers/environment";
import ShowClothes from "./ShowClothes";
import IconDialog from "./IconDialog";

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
    width: "600px",
    alignItems: "center",
    textAlign: "center",
  },
  track: {
    color: "red",
    opacity: 1,
  },
  rail: {
    color: "green",
    opacity: 1,
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
  slider: {
    width: "80%",
    marginTop: "40px",
  },
});
interface NewClothesProps extends WithStyles<typeof styles> {
  showClothes: boolean;
  child: ChildKeys;
  sessionToken: string;
  classes: {
    root: string;
    track: string;
    rail: string;
    input: string;
    paper: string;
    button: string;
    slider: string;
  };
  closeNewClothes: () => void;
  getAllClothes: () => void;
}

interface NewClothesState {
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
  clicked: boolean;
  step: number;
  badName: boolean;
  flipped: boolean;
  tempValue: number | null;
  clothes: Clothes[];
}

class NewClothes extends React.Component<NewClothesProps, NewClothesState> {
  constructor(props: NewClothesProps) {
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
      clothes: [],
      clicked: false,
      step: -1,
      badName: true,
      flipped: true,
      tempValue: null,
    };
  }

  handleStep0Change = (event: any, newValue: number | number[]) => {
    this.setState({ step0values: newValue as number[] });
  };
  handleStep1Change = (event: any, newValue: number | number[]): void => {
    this.setState({ step1value: newValue as number });
  };
  setIcon = (iconString: string) => {
    this.setState({ icon: iconString });
  };
  handleSubmit = (): void => {
    this.setState({ clicked: true });
    switch (this.state.step) {
      case -1:
        if (!this.state.badName) {
          this.setState({ step: 0 });
        }
        break;
      case 0:
        this.setState({
          clicked: false,
          minTemp: Math.min(...this.state.step0values),
          maxTemp: Math.max(...this.state.step0values),
          step1value: Math.round(
            (Math.min(...this.state.step0values) +
              Math.max(...this.state.step0values)) /
              2
          ),
          step: 1,
        });
        break;
      case 1:
        let oMin, oMax, rMin, rMax: number | null;
        if (!this.state.flipped) {
          if (this.state.step1value === this.state.minTemp) {
            rMin = this.state.minTemp;
            rMax = this.state.maxTemp;
            oMin = null;
            oMax = null;
          } else if (this.state.step1value === this.state.maxTemp) {
            oMin = this.state.minTemp;
            oMax = this.state.maxTemp;
            rMin = null;
            rMax = null;
          } else {
            oMin = this.state.minTemp;
            oMax = this.state.step1value;
            rMin = this.state.step1value;
            rMax = this.state.maxTemp;
          }
        } else {
          if (this.state.step1value === this.state.minTemp) {
            oMin = this.state.minTemp;
            oMax = this.state.maxTemp;
            rMin = null;
            rMax = null;
          } else if (this.state.step1value === this.state.maxTemp) {
            rMin = this.state.minTemp;
            rMax = this.state.maxTemp;
            oMin = null;
            oMax = null;
          } else {
            rMin = this.state.minTemp;
            rMax = this.state.step1value;
            oMin = this.state.step1value;
            oMax = this.state.maxTemp;
          }
        }
        this.addClothes(rMin, rMax, oMin, oMax);
        this.setState({
          name: "",
          clicked: false,
          step: -1,
          category: "",
          icon: "",
          step0values: [30, 70],
          step1value: 40,
        });
        this.props.closeNewClothes();
        break;
      default:
        break;
    }
  };
  valuetext(value: number) {
    return `${value}°F`;
  }
  addClothes = async (
    rMin: number | null,
    rMax: number | null,
    oMin: number | null,
    oMax: number | null
  ): Promise<void> => {
    await fetch(`${APIURL}/clothing/create/${this.props.child.id}`, {
      method: "POST",
      body: JSON.stringify({
        clothing: {
          name: this.state.name,
          icon: this.state.icon,
          category: this.state.category,
          requiredMin: rMin,
          requiredMax: rMax,
          optionalMin: oMin,
          optionalMax: oMax,
          minTemp: this.state.minTemp,
          maxTemp: this.state.maxTemp,
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
    this.getAllClothes();
    this.props.getAllClothes();
  };
  getAllClothes = async () => {
    const result = await fetch(
      `${APIURL}/clothing/all/${this.props.child.id}`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: this.props.sessionToken,
        }),
      }
    );
    const clothes = await result.json();
    this.setState({ clothes: clothes, badName: true });
  };
  marginBottom = () => {
    if (this.props.showClothes) {
      return "10px";
    } else {
      return "0px";
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid justify="center" container>
          <Grid item>
            <Paper
              className={classes.paper}
              style={{ marginBottom: this.marginBottom() }}
            >
              {this.state.step === -1 && (
                <div>
                  <div>
                    <Typography variant="h5">
                      What's something that {this.props.child.name} wears?
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption">
                      The more items you add, the better
                    </Typography>
                  </div>
                  <div>
                    <TextField
                      className={classes.input}
                      error={this.state.badName && this.state.clicked}
                      helperText={
                        this.state.badName && this.state.clicked
                          ? "Required"
                          : ""
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
                  </div>
                  <div style={{ height: "50px" }}>
                    <IconDialog icon={this.state.icon} setIcon={this.setIcon} />
                  </div>
                  <div>
                    <Button
                      className={classes.button}
                      onClick={this.handleSubmit}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              {this.state.step === 0 && (
                <div style={{ width: "100%" }}>
                  <Typography id="range-slider" gutterBottom>
                    In what range of temperatures would {this.props.child.name}{" "}
                    wear {this.state.name}?:
                  </Typography>
                  <Slider
                    className={classes.slider}
                    value={this.state.step0values}
                    onChange={this.handleStep0Change}
                    aria-labelledby="range-slider"
                    getAriaValueText={this.valuetext}
                    valueLabelFormat={this.valuetext}
                    valueLabelDisplay="on"
                    marks={marks}
                    min={-30}
                    max={110}
                    defaultValue={[30, 70]}
                  />
                  <div>
                    <Button
                      className={classes.button}
                      onClick={this.handleSubmit}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              {this.state.step === 1 && (
                <div style={{ width: "100%" }}>
                  <div>
                    <Typography id="range-slider" gutterBottom>
                      In what ranges should {this.state.name} be{" "}
                      <span style={{ fontWeight: "bold", color: "red" }}>
                        required
                      </span>{" "}
                      or{" "}
                      <span style={{ fontWeight: "bold", color: "green" }}>
                        optional
                      </span>
                      ?:
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption">
                      Click the slider to toggle the position of
                      required/optional
                    </Typography>
                  </div>
                  <Slider
                    classes={
                      this.state.flipped
                        ? {
                            root: classes.slider,
                            track: classes.track,
                            rail: classes.rail,
                          }
                        : {
                            root: classes.slider,
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
                        value: this.state.minTemp,
                        label: `${this.state.minTemp}°F`,
                      },
                      {
                        value: this.state.maxTemp,
                        label: `${this.state.maxTemp}°F`,
                      },
                    ]}
                    min={this.state.minTemp}
                    max={this.state.maxTemp}
                    // defaultValue={}
                  />
                  <div>
                    <Button
                      className={classes.button}
                      onClick={this.handleSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </Paper>
          </Grid>

          <Grid item>
            {this.state.clothes.length > 0 && this.props.showClothes && (
              <ShowClothes
                setActiveClothes={() => {}}
                setOpenClothes={() => {}}
                delete={false}
                child={this.props.child}
                getAllClothes={this.getAllClothes}
                sessionToken={this.props.sessionToken}
                clothes={this.state.clothes}
              />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(NewClothes);
