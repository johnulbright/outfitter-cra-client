import React from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
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
import outfitterLogo from '../../assets/outfitter-logo.png'

const drawerWidth = 200;
const barHeight = 70;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    drawer: {
      [theme.breakpoints.up("sm")]: {
        marginTop: 500,
        width: drawerWidth,
        flexShrink: 0,

      },
    },
    appBar: {
      [theme.breakpoints.up("sm")]: {
        zIndex: theme.zIndex.drawer + 1,
        // width: `calc(100% - ${drawerWidth}px)`,
        // marginLeft: drawerWidth,
        width: "100%",
        marginLeft: "0px",
        height: barHeight,
      backgroundColor:"#ffca28"

      },
    },
    logoutButton:{
        // float:'right',
        // color:'pink',
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
  getAllUsernames: () => void;
  getMyChildren: () => void;
  setActiveChild: (child: ChildKeys) => void;
  weather: Weather;
  city: string | null;
  sessionToken: string;
  children: ChildKeys[];
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function HeaderWithCollapse(props: Props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div style={{backgroundColor:'#e0e0e0', zIndex: 0, marginTop: `${barHeight}px` }}>
      {/* <div className={classes.toolbar} /> */}

      {/* <Divider /> */}
      <Typography variant="h6">{props.city} weather:</Typography>
      <List>
        <ListItem>
          <Card style={{ width: "100%", textAlign: "center" }}>
            <h4>Currently</h4>
            <p>
              {props.weather.current.temp !== 999 &&
                Math.round((props.weather.current.temp - 273.15) * 1.8 + 32)}
              °{" "}
            </p>
            <img
              src={`http://openweathermap.org/img/wn/${props.weather.current.weather[0].icon}@2x.png`}
            />
            <p>{props.weather.current.weather[0].description}</p>
          </Card>
        </ListItem>
        <ListItem>
          <Card style={{ width: "100%", textAlign: "center" }}>
            <h4>Today</h4>
            <p>
              {Math.round(
                (props.weather.daily[0].temp.max - 273.15) * 1.8 + 32
              )}
              ° /{" "}
              {Math.round(
                (props.weather.daily[0].temp.min - 273.15) * 1.8 + 32
              )}
              °{" "}
            </p>
            <img
              src={`http://openweathermap.org/img/wn/${props.weather.daily[0].weather[0].icon}@2x.png`}
            />
            <p>{props.weather.daily[0].weather[0].description}</p>
          </Card>
        </ListItem>
        <ListItem>
          <Card style={{ width: "100%", textAlign: "center" }}>
            <h4>Tomorrow</h4>
            <p>
              {Math.round(
                (props.weather.daily[1].temp.max - 273.15) * 1.8 + 32
              )}
              ° /{" "}
              {Math.round(
                (props.weather.daily[1].temp.min - 273.15) * 1.8 + 32
              )}
              °{" "}
            </p>
            <img
              src={`http://openweathermap.org/img/wn/${props.weather.daily[1].weather[0].icon}@2x.png`}
            />
            <p>{props.weather.daily[1].weather[0].description}</p>
          </Card>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
         <img style={{height:'40px'}}src={outfitterLogo} alt='outfitter logo'/>
          <IconButton edge='end'>
          <Button  className={classes.logoutButton} onClick={props.clearToken}>Logout</Button>
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
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
          getAllUsernames={props.getAllUsernames}
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
