import React from "react";
import {Link} from 'react-router-dom'
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined'
import Child from "../children/Child";
import APIURL from "../../helpers/environment.js";
import {ChildKeys,Weather} from '../../types'

interface ChildIndexProps {
  sessionToken: string;
  weather: Weather;
  children: ChildKeys[];
  getMyChildren:()=>void
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
      <div >
        <Link to="/addchild"><PersonAddOutlinedIcon style={{color:'#3a5e25'}} fontSize="large" type="button"/></Link>
        <div style={{flexWrap:"wrap"}}>
        {this.props.children?.map((child:ChildKeys) => (

          <Child 
            weather={this.props.weather}
            sessionToken={this.props.sessionToken} 
            key={child.id} 
            child={child}
            getMyChildren={this.props.getMyChildren}
            setActiveChild={this.props.setActiveChild}
          />
        ))}
        </div>
      </div>
    );
  }
}
