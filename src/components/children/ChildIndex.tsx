import React from "react";
import {Link} from 'react-router-dom'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import Child from "../children/Child";
import APIURL from "../../helpers/environment.js";
import {ChildKeys} from '../../types'

interface ChildIndexProps {
  sessionToken: string;
  weather: object;
  children: ChildKeys[];
  // takenUsernames: string[];
  getMyChildren:()=>void
  getAllUsernames:()=>void
  setActiveChild:(child:ChildKeys)=>void
}
interface ChildIndexState {
}

export default class ChildIndex extends React.Component<ChildIndexProps,ChildIndexState> {
  constructor(props: ChildIndexProps) {
    super(props);
    this.state = {
    };
  }


  componentDidMount() {
    this.props.getMyChildren();
  }

  
  render() {
    return (
      <div>
        <Link to="/addchild"><PersonAddOutlinedIcon fontSize="large" type="button"/></Link>

        {this.props.children?.map((child:ChildKeys) => (
          <Child 
            sessionToken={this.props.sessionToken} 
            key={child.id} 
            child={child}
            getMyChildren={this.props.getMyChildren}
            getAllUsernames={this.props.getAllUsernames}
            setActiveChild={this.props.setActiveChild}
          />
        ))}
      </div>
    );
  }
}
