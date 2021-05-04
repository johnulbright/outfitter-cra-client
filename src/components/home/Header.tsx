import React from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";

import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import ChildIndex from "../children/ChildIndex";
import { Weather, ChildKeys } from "../../types";
import outfitterLogo from "../../assets/outfitter-logo.png";

const drawerWidth = 200;
const barHeight = 70;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      backgroundColor: "#96bb7c",
      width: "100%",
      textAlign: "center",
    },
    root: {
      display: "flex",
      width: "100%",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      backgroundColor: "#eebb4d",
      height: barHeight,

      [theme.breakpoints.up("sm")]: {
        zIndex: theme.zIndex.drawer + 1,
        width: "100%",
        marginLeft: "0px",
      },
    },
    logoutButton: {
      margin: "calc(100% - 260px)",
      [theme.breakpoints.up("sm")]: {
        margin: "calc(100% - 200px)",
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

interface Props {
  clearToken: () => void;
  getMyChildren: () => void;
  setActiveChild: (child: ChildKeys) => void;
  weather: Weather;
  city: string | null;
  sessionToken: string;
  children: ChildKeys[];
}

export default function HeaderWithCollapse(props: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div
      style={{
        backgroundColor: "#e3dfc8",
        zIndex: 0,
        marginTop: !mobileOpen ? `${barHeight}px` : "0px",
      }}
    >
      <br />
      <Typography variant="h6">{props.city} weather:</Typography>
      <List>
        <ListItem>
          <Card className={classes.card}>
            <h4>Currently</h4>
            <p style={{ marginBottom: "0px" }}>
              {props.weather.current.temp !== 999 &&
                Math.round((props.weather.current.temp - 273.15) * 1.8 + 32)}
              °{" "}
            </p>
            <img alt='current-weather-icon'
              src={`http://openweathermap.org/img/wn/${props.weather.current.weather[0].icon}@2x.png`}
            />
            <p style={{ marginTop: "0px" }}>
              {props.weather.current.weather[0].description}
            </p>
          </Card>
        </ListItem>
        <ListItem>
          <Card className={classes.card}>
            <h4>Today</h4>
            <p style={{ marginBottom: "0px" }}>
              {Math.round(
                (props.weather.daily[0].temp.max - 273.15) * 1.8 + 32
              )}
              ° /{" "}
              {Math.round(
                (props.weather.daily[0].temp.min - 273.15) * 1.8 + 32
              )}
              °{" "}
            </p>
            <img alt='todays-weather-icon'
              src={`http://openweathermap.org/img/wn/${props.weather.daily[0].weather[0].icon}@2x.png`}
            />
            <p style={{ marginTop: "0px" }}>
              {props.weather.daily[0].weather[0].description}
            </p>
          </Card>
        </ListItem>
        <ListItem>
          <Card className={classes.card}>
            <h4>Tomorrow</h4>
            <p style={{ marginBottom: "0px" }}>
              {Math.round(
                (props.weather.daily[1].temp.max - 273.15) * 1.8 + 32
              )}
              ° /{" "}
              {Math.round(
                (props.weather.daily[1].temp.min - 273.15) * 1.8 + 32
              )}
              °{" "}
            </p>
            <img alt='tomorrows-weather-icon'
              src={`http://openweathermap.org/img/wn/${props.weather.daily[1].weather[0].icon}@2x.png`}
            />
            <p style={{ marginTop: "0px" }}>
              {props.weather.daily[1].weather[0].description}
            </p>
          </Card>
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <img
            style={{ width: "135px" }}
            src={outfitterLogo}
            alt="outfitter logo"
          />
          <Button className={classes.logoutButton} onClick={props.clearToken}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <ChildIndex
          weather={props.weather}
          getMyChildren={props.getMyChildren}
          sessionToken={props.sessionToken}
          setActiveChild={props.setActiveChild}
          children={props.children}
        />
      </main>
    </div>
  );
}
