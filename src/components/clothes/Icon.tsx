import React from "react";

import ClothesDictionary from "./clothesIcons";

interface IconProps {
  size: number;
  isSelected: boolean;
  icon: string;
  setIcon: (iconString: string) => void;
}

export default class Icon extends React.Component<IconProps, {}> {

  backgroundColor = () => (this.props.isSelected ? "#96bb7c" : "none");
  render() {
    return (
      <img
        onClick={() => {
          this.props.setIcon(this.props.icon);
        }}
        style={{
          height: `${Math.floor(50 * this.props.size)}px`,
          width: `${Math.floor(50 * this.props.size)}px`,
          margin: "5px",
          backgroundColor: `${this.backgroundColor()}`,
        }}
        src={ClothesDictionary[this.props.icon]}
        alt={`${this.props.icon} icon`}
      ></img>
    );
  }
}
