import React from "react";
import { Link } from "react-router-dom";
import Delete from "@material-ui/icons/DeleteOutline";
import Pencil from "@material-ui/icons/EditOutlined";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";

import { ChildKeys } from "../../types";
import APIURL from "../../helpers/environment.js";

const styles = createStyles({
  icon: {
    color: "#678b4f",
    "&:hover": {
      color: "#96bb7c",
      cursor: "pointer",
    },
  },
});
interface ChangeChildProps extends WithStyles<typeof styles> {
  child: ChildKeys;
  sessionToken: string;
  getMyChildren: () => void;
  setActiveChild: (child: ChildKeys) => void;
  classes: {
    icon: string;
  };
}

interface ChangeChildState {
  deleteOpen: boolean;
}

class ChangeChild extends React.Component<ChangeChildProps, ChangeChildState> {
  constructor(props: ChangeChildProps) {
    super(props);
    this.state = {
      deleteOpen: false,
    };
  }
  deleteChild = async (): Promise<void> => {
    await fetch(`${APIURL}/child/delete/${this.props.child.id}`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: this.props.sessionToken,
      }),
    });
    this.handleDeleteClose();
    this.props.getMyChildren();
  };

  handleDeleteClose = () => {
    this.setState({ deleteOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Link to="/editchild">
          <Pencil
            className={classes.icon}
            onClick={() => this.props.setActiveChild(this.props.child)}
          />
        </Link>
        <Delete
          className={classes.icon}
          onClick={(event: React.MouseEvent) =>
            this.setState({ deleteOpen: true })
          }
        />
        <Dialog
          open={this.state.deleteOpen}
          onClose={this.handleDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{`Are you sure you want to remove ${this.props.child.name}?`}</DialogTitle>

          <DialogActions>
            <Button onClick={this.deleteChild} color="secondary">
              Yes
            </Button>
            <Button
              onClick={this.handleDeleteClose}
              style={{ color: "#678b4f" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default withStyles(styles)(ChangeChild);
