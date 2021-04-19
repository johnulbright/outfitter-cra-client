import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  Redirect,
} from "react-router-dom";

import Button from "@material-ui/core/Button";

import ChildIndex from "../children/ChildIndex";
import Header from "./Header";
import CreateChild from "../children/CreateChild";
import EditChild from '../children/EditChild'

import { Weather,ChildKeys,Clothes } from "../../types";
import APIURL from '../../helpers/environment'

interface HomeProps {
  clearToken: () => void;
  sessionToken: string;
  weather: Weather;
  city: string | null;
}
interface HomeState {
    activeChild:ChildKeys;
    children: ChildKeys[];
    takenUsernames: string[];
    }


export default class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {
        activeChild:{
            id:-1,
            username:'',
            name:'',
            parentId:-1
        },
        takenUsernames:[],
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

  getAllUsernames = async () => {
    const result = await fetch(`${APIURL}/child/all`, {
       method: "GET",
       headers: new Headers({
         "Content-Type": "application/json",
         Authorization: this.props.sessionToken,
       }),
     });
     const allChildren = await result.json();
     let usernamesOnly=allChildren.map((child:any)=>child.username)
     // Is this a problem? Better soln?-------^^^
     this.setState({ takenUsernames: usernamesOnly });
   };

   componentDidMount(): void{
    this.getMyChildren()
   }
  render() {
    return (
      <div>
        <Header
          city={this.props.city}
          weather={this.props.weather}
          clearToken={this.props.clearToken}
        />
        <Router>
          <Switch>
            <Route exact path="/">
              <ChildIndex getAllUsernames={this.getAllUsernames} weather={this.props.weather} getMyChildren={this.getMyChildren} sessionToken={this.props.sessionToken} setActiveChild={this.setActiveChild} children={this.state.children}/>
            </Route>
            <Route path="/addchild">
              <CreateChild getMyChildren={this.getMyChildren} getAllUsernames={this.getAllUsernames} takenUsernames={this.state.takenUsernames} sessionToken={this.props.sessionToken} />
            </Route>
            <Route path="/editchild">
              <EditChild sessionToken={this.props.sessionToken} child={this.state.activeChild}/>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
