import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Delete from "@material-ui/icons/DeleteOutline";
import Pencil from "@material-ui/icons/EditOutlined";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";

import "./clothes.css";
import { Clothes } from "../../types";
import APIURL from "../../helpers/environment";
import Icon from "./Icon";
import { ChildKeys } from "../../types";

const styles = createStyles({
  icon: {
    color: "#678b4f",
    "&:hover": {
      color: "#96bb7c",
      cursor: "pointer",
    },
  },
});

interface ShowClothesProps extends WithStyles<typeof styles> {
  child: ChildKeys;
  clothes: Clothes[];
  sessionToken: string;
  getAllClothes: () => void;
  setOpenClothes: (TorF: boolean) => void;
  setActiveClothes: (clothes: Clothes) => void;
  delete: boolean;
  classes: {
    icon: string;
  };
}

interface ShowClothesState {
  open: boolean;
}

class ShowClothes extends React.Component<ShowClothesProps, ShowClothesState> {
  constructor(props: ShowClothesProps) {
    super(props);
    this.state = {
      open: false,
    };
  }
  deleteClothes = async (event: any, id: number): Promise<void> => {
    event.preventDefault();
    await fetch(`${APIURL}/clothing/delete/${id}`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    this.props.getAllClothes();
  };
  handlePencilClick = (event: any, clothes: Clothes): void => {
    event.preventDefault();
    this.props.setOpenClothes(true);
    this.props.setActiveClothes(clothes);
  };
  marginHelp = () => {
    if (this.props.delete) {
      return "0px";
    } else {
      return "10px";
    }
  };
  render() {
    const { classes } = this.props;

    return (
      <div style={{ marginLeft: this.marginHelp() }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item of clothing</TableCell>
                <TableCell>Icon</TableCell>
                <TableCell>Temperature range</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.clothes?.map((item) => {
                const requiredLow =
                  item.optionalMin === null ||
                  (item.requiredMin !== null &&
                    item.requiredMin < item.optionalMin);
                const requiredProportion =
                  item.requiredMin && item.requiredMax
                    ? Math.floor(
                        (100 * (item.requiredMax - item.requiredMin)) / 140
                      )
                    : 0;
                const optionalProportion =
                  item.optionalMin && item.optionalMax
                    ? Math.floor(
                        (100 * (item.optionalMax - item.optionalMin)) / 140
                      )
                    : 0;
                const unusedLeft = Math.floor(
                  (100 *
                    (Math.min(
                      item.requiredMin === null ? 110 : item.requiredMin,
                      item.optionalMin === null ? 110 : item.optionalMin
                    ) +
                      30)) /
                    140
                );
                const unusedRight = Math.floor(
                  (100 *
                    (110 -
                      Math.max(
                        item.requiredMax === null ? -30 : item.requiredMax,
                        item.optionalMax === null ? -30 : item.optionalMax
                      ))) /
                    140
                );
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {item.icon !== null && item.icon !== "" && (
                        <Icon
                          size={1}
                          isSelected={false}
                          setIcon={() => {}}
                          icon={item.icon}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="clothesLine">
                        <div
                          className="clothesLineSegment unused"
                          style={{ flex: `${unusedLeft} 0 auto` }}
                        ></div>
                        <div
                          className={`clothesLineSegment ${
                            requiredLow ? "required" : "optional"
                          }`}
                          style={{
                            flex: `${
                              requiredLow
                                ? requiredProportion
                                : optionalProportion
                            } 0 auto`,
                          }}
                        ></div>
                        <div
                          className={`clothesLineSegment ${
                            requiredLow ? "optional" : "required"
                          }`}
                          style={{
                            flex: `${
                              requiredLow
                                ? optionalProportion
                                : requiredProportion
                            } 0 auto`,
                          }}
                        ></div>
                        <div
                          className="clothesLineSegment unused"
                          style={{ flex: `${unusedRight} 0 auto` }}
                        ></div>
                      </div>
                    </TableCell>
                    {this.props.delete && (
                      <TableCell>
                        <Pencil
                          className={classes.icon}
                          onClick={(e) => this.handlePencilClick(e, item)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Delete
                        className={classes.icon}
                        onClick={(e) => this.deleteClothes(e, item.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withStyles(styles)(ShowClothes);
