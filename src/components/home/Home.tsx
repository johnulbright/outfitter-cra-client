import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  Redirect,
} from "react-router-dom";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";


import Button from "@material-ui/core/Button";

import ChildIndex from "../children/ChildIndex";

import Header from "./Header";

import CreateChild from "../children/CreateChild";
import EditChild from '../children/EditChild'

import { Weather,ChildKeys,Clothes } from "../../types";
import APIURL from '../../helpers/environment'

const styles = createStyles({
  body: {
    // backgroundColor:"pink"
  }
})
interface HomeProps extends WithStyles<typeof styles> {
  clearToken: () => void;
  sessionToken: string;
  weather: Weather;
  city: string | null;
  classes:{
    body:string
  }
}
interface HomeState {
    activeChild:ChildKeys;
    children: ChildKeys[];
    }


class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
        activeChild:{
            id:-1,
            username:'',
            name:'',
            parentId:-1,
            underwearRemind:false,
        },
        children:[],
    };
  }
  setActiveChild=(child:ChildKeys): void=>{
      this.setState({activeChild:child})
  }
  getMyChildren = async () => {
    const result = await fetch(`${APIURL}/child/allofparent`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    const allChildren = await result.json();
    this.setState({ children: allChildren });
  };

  
   componentDidMount(): void{
    this.getMyChildren()
   }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.body}>
        
        <Router>
          <Switch>
            <Route exact path="/">
            <Header
              clearToken={this.props.clearToken}
              city={this.props.city}
              weather={this.props.weather}
              getMyChildren={this.getMyChildren} 
              sessionToken={this.props.sessionToken} setActiveChild={this.setActiveChild} 
              children={this.state.children}/>
          
            </Route>
            <Route path="/addchild">
              <CreateChild clearToken={this.props.clearToken} getMyChildren={this.getMyChildren} sessionToken={this.props.sessionToken} />
            </Route>
            <Route path="/editchild">
              <EditChild clearToken={this.props.clearToken} sessionToken={this.props.sessionToken} setActiveChild={this.setActiveChild} child={this.state.activeChild}/>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
export default withStyles(styles)(Home);
 