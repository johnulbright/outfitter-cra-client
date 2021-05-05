import React from "react";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import { talk } from "browser-speech";
import { Clothes, DailyWeather } from "../../types";

const styles = createStyles({
  button:{
    backgroundColor: "#678b4f",
    "&:hover": {
      backgroundColor: "#96bb7c",
    }
  }
});

interface OutfitSpeechProps extends WithStyles<typeof styles> {
  weather: DailyWeather;
  clothes: { clothes: Clothes; points: number }[];
  day: string;
  underwearRemind: boolean | null;
  classes: {
    button:string;
  };
}

class OutfitSpeech extends React.Component<
  OutfitSpeechProps,
  {}
> {
  
  sayThis = () => {
    const conditions = this.props.weather.weather[0].description;
    const max = Math.floor((this.props.weather.temp.max - 273.15) * 1.8 + 32);
    const min = Math.floor((this.props.weather.temp.min - 273.15) * 1.8 + 32);
    const definitelyWear = this.props.clothes.filter(
      (item) => item.points >= 0.66
    );
    let definitelyWearText: string = "";
    if (definitelyWear.length > 0) {
      definitelyWearText = "The clothes you should definitely wear include:";
      for (let i = 0; i < definitelyWear.length; i++) {
        definitelyWearText += ` ${definitelyWear[i].clothes.name},`;
      }
      definitelyWearText += ".'";
    }
    const mightWear = this.props.clothes.filter(
      (item) => item.points >= 0.34 && item.points < 0.66
    );
    let mightWearText: string = "";
    if (mightWear.length > 0) {
      mightWearText = "The clothes you might wear include:";
      for (let i = 0; i < mightWear.length; i++) {
        mightWearText += ` ${mightWear[i].clothes.name},`;
      }
      mightWearText += ".";
    }
    const dontWear = this.props.clothes.filter(
      (item) => item.points > 0 && item.points < 0.34
    );
    let dontWearText: string = "";
    if (dontWear.length > 0) {
      dontWearText = `${this.props.day} is not a good day to wear:`;
      for (let i = 0; i < dontWear.length; i++) {
        dontWearText += ` ${dontWear[i].clothes.name},`;
      }
      dontWearText += ".";
    }
    let undies: string = this.props.underwearRemind
      ? "And remember to change your underwear!"
      : "";
    const sentence = `${this.props.day} will have ${conditions} with a high of ${max} degrees and a low of ${min} degrees. ${definitelyWearText} ${mightWearText} ${dontWearText} ${undies}`;
    console.log(sentence);
    talk(sentence)
  };
  
  render() {
    const { classes } = this.props;
    return (
       
        <Button className={classes.button} onClick={this.sayThis}><PlayArrowIcon/></Button>
    );
  }
}

export default withStyles(styles)(OutfitSpeech);
