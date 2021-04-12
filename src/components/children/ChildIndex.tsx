import React from "react";
import Button from "@material-ui/core/Button";

import NewChild from "../children/NewChild";
import Child from "../children/Child";
import APIURL from "../../helpers/environment.js";

interface ChildIndexProps {
  sessionToken: string;
  weather: object;
}
interface ChildIndexState {
  children: {
    id:number
    name: string;
    username: string;
    deviceId?: string;
    parentId: number;
  }[];
  takenUsernames: string[];
}

export default class ChidlIndex extends React.Component<
  ChildIndexProps,
  ChildIndexState
> {
  constructor(props: ChildIndexProps) {
    super(props);
    this.state = {
      children: [],
      takenUsernames: [],
    };
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
    console.log("my kids", allChildren);
    this.setState({ children: allChildren });
  };

  componentWillMount() {
    this.getMyChildren();
    this.getAllUsernames();
  }

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
    console.log("all usernames", usernamesOnly);
    this.setState({ takenUsernames: usernamesOnly });
  };
  render() {
    return (
      <div>
        <h2>Home</h2>
        <NewChild
          sessionToken={this.props.sessionToken}
          getMyChildren={this.getMyChildren}
          takenUsernames={this.state.takenUsernames} 
        />
        {this.state.children?.map((child) => (
          <Child key={child.id} child={child} />
        ))}
      </div>
    );
  }
}
