import React from "react";
import { Link } from "react-router-dom";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import Grid from "@material-ui/core/Grid";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import Child from "../children/Child";
import { ChildKeys, Weather } from "../../types";

const styles = createStyles({
  icon: {
    color: "#678b4f",
    "&:hover": {
      color: "#96bb7c",
      cursor: "pointer",
    },
  },
});
interface ChildIndexProps extends WithStyles<typeof styles> {
  sessionToken: string;
  weather: Weather;
  children: ChildKeys[];
  getMyChildren: () => void;
  setActiveChild: (child: ChildKeys) => void;
  classes: {
    icon: string;
  };
}

class ChildIndex extends React.Component<ChildIndexProps, {}> {

  componentDidMount() {
    this.props.getMyChildren();
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Link to="/addchild">
          <PersonAddOutlinedIcon
            className={classes.icon}
            fontSize="large"
            type="button"
          />
        </Link>
        <Grid container justify="center">
          {this.props.children?.map((child: ChildKeys) => (
            <Grid item key={child.id}>
              <Child
                weather={this.props.weather}
                sessionToken={this.props.sessionToken}
                key={child.id}
                child={child}
                getMyChildren={this.props.getMyChildren}
                setActiveChild={this.props.setActiveChild}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}
export default withStyles(styles)(ChildIndex);
