import React from 'react'
import { Link } from 'react-router-dom'
import Delete from '@material-ui/icons/DeleteOutline'
import Pencil from '@material-ui/icons/EditOutlined'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';


import { ChildKeys } from '../../types'
import APIURL from "../../helpers/environment.js";

interface ChangeChildProps {
  child: ChildKeys;
  sessionToken: string;
  getMyChildren: () => void;
  setActiveChild: (child: ChildKeys) => void


}
interface ChangeChildState {
  deleteOpen: boolean;
}

export default class ChangeChild extends React.Component<ChangeChildProps, ChangeChildState>{
  constructor(props: ChangeChildProps) {
    super(props);
    this.state = {
      deleteOpen: false,
    }
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
  }


  handleDeleteClose = () => {
    this.setState({ deleteOpen: false });
  };

  render() {
    return (
      <div>
        <Link to="/editchild"><Pencil style={{color:'#3a5e25'}} onClick={() => this.props.setActiveChild(this.props.child)} /></Link>
        <Delete style={{color:'#3a5e25'}} onClick={(event: React.MouseEvent) =>
          this.setState({ deleteOpen: true })} />
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
            <Button onClick={this.handleDeleteClose} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        
      </div>
    )
  }
}