import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import TextField from "@material-ui/core/TextField";

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import { GiClothes } from "react-icons/gi";
import Add from '@material-ui/icons/Add'
import { createStyles, WithStyles, withStyles } from "@material-ui/styles";
import Pencil from '@material-ui/icons/EditOutlined'
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import outfitterLogo from '../../assets/outfitter-logo.png'

import { ChildKeys, Clothes } from '../../types'
import ShowClothes from '../clothes/ShowClothes'
import EditClothes from '../clothes/EditClothes'
import EditEvents from '../events/EditEvents'
import NewClothes from '../clothes/NewClothes'
import APIURL from '../../helpers/environment'



const styles = createStyles({
    appBar: {
        backgroundColor: "#eebb4d",
        height: 70,

        width: "100%",
        marginLeft: "0px",
    },
    logoutButton: {
        // margin:'70vw',
        // color:'pink',
    },
    dialog: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 'auto',
        display: "flex",
        width: "400px",
        marginBottom:'10px'
    },
    input: {
        width: '300px',
        marginTop: '10px'
    },  
    leftCard:{
        margin: '5px',
        // backgroundColor:'#e3dfc8',
      },
      rightCard:{
        backgroundColor: '#F5F5F6',
        margin: '5px'
      }
})


interface EditChildProps extends WithStyles<typeof styles> {
    setActiveChild: (child: ChildKeys) => void;
    clearToken: () => void;
    child: ChildKeys;
    sessionToken: string;
    classes: {
        appBar: string;
        logoutButton: string;
        dialog: string;
        input: string;
        leftCard:string;
        rightCard:string;
    }
}

interface EditChildState {
    openEditClothes: boolean;
    openNewClothes: boolean;
    activeClothes: Clothes | null;
    clothes: Clothes[];
    newName: string;
    badNewName: boolean;
    badNewUsername: boolean;
    newUsername: string;
    editNameOpen: boolean;
    clicked: boolean;
    underwearRemind: boolean;

}

class EditChild extends React.Component<EditChildProps, EditChildState>{
    constructor(props: EditChildProps) {
        super(props)
        this.state = {
            openEditClothes: false,
            openNewClothes: false,
            clothes: [],
            activeClothes: null,
            newName: '',
            newUsername: '',
            editNameOpen: false,
            badNewName: false,
            badNewUsername: false,
            clicked: false,
            underwearRemind: false
        }
    }
    handleCloseNewClothes = () => {
        this.setState({ openNewClothes: false })
        this.getAllClothes();
    }
    getAllClothes = async () => {
        const result = await fetch(`${APIURL}/clothing/all/${this.props.child.id}`, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                Authorization: this.props.sessionToken,
            })
        })
        const clothes = await result.json();
        const sortedClothes: Clothes[] = clothes.sort((a: Clothes, b: Clothes) => {
            return (a.id - b.id)
        })
        this.setState({ clothes: sortedClothes })
    }
    setActiveClothes = (clothes: Clothes) => {
        this.setState({ activeClothes: clothes })
        console.log(clothes)
    }
    setOpenClothes = (TorF: boolean) => {
        this.setState({ openEditClothes: TorF })
    }

    closeNewClothes = () => {
        this.setState({ openNewClothes: false })
    }
    componentDidMount() {
        this.getAllClothes()
    }
    handleNameOpen = () => {
        console.log('active child', this.props.child)
        this.setState({ newName: this.props.child.name === null ? '' : this.props.child.name, newUsername: this.props.child.username === null ? '' : this.props.child.username, underwearRemind: this.props.child.underwearRemind === null ? false : this.props.child.underwearRemind })

        this.setState({ editNameOpen: true })
    }
    handleNameClose = () => {

        this.setState({ editNameOpen: false })
    }
    changeName = async () => {
        this.setState({ clicked: true })
        const result = await fetch(`${APIURL}/child/edit/${this.props.child.id}`, {
            method: "PUT",
            body: JSON.stringify({
                child: {
                    name: this.state.newName,
                    username: this.state.newUsername,
                    underwearRemind: this.state.underwearRemind,
                },
            }),
            headers: new Headers({
                "Content-Type": "application/json",
                Authorization: this.props.sessionToken,
            }),
        });
        const json = await result.json();
        console.log(json)
        if (json.name === "SequelizeUniqueConstraintError") {
            this.setState({ badNewUsername: true })


        } else if (json.result) {
            console.log(json.result)
            this.setState({ badNewUsername: false, editNameOpen: false })
            this.props.setActiveChild(json.child)
        } else {
            this.setState({ editNameOpen: false })

        }

    }

    render() {
        if (this.props.child.id === -1) {
            return (
                <Redirect to={"/"} />
            )
        }
        const { classes } = this.props;

        return (
            <div>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>

                        <img style={{ width: '135px' }} src={outfitterLogo} alt='outfitter logo' />
                        <Button className={classes.logoutButton} onClick={this.props.clearToken}>Logout</Button>
                    </Toolbar>
                </AppBar>
                <div style={{ marginTop: '100px', marginBottom: '30px' }}>

                    <Typography variant='h3'>Editing {this.props.child.name}<Pencil style={{color:'#96bb7c'}}onClick={this.handleNameOpen} /></Typography>
                    <Link style={{textDecoration: 'none' }}to="/"><Button variant='contained' style={{marginTop:'10px', backgroundColor:'#96bb7c'}}>Done</Button></Link>
                </div>

                <Dialog className={classes.dialog} open={this.state.editNameOpen} >
                    <Card>
                        <div className={classes.dialog}>
                            <TextField
                                className={classes.input}
                                value={this.state.newName}
                                error={this.state.badNewName && this.state.clicked}
                                helperText={
                                    this.state.badNewName && this.state.clicked ? "Required" : ""
                                }
                                label="Name"
                                onChange={(e) => {
                                    this.setState({
                                        newName: e.target.value,
                                        badNewName: e.target.value.length === 0,
                                    });
                                }}
                            />
                        </div>
                        <div  className={classes.dialog}>
                            <TextField
                                className={classes.input}
                                value={this.state.newUsername}
                                error={this.state.badNewUsername && this.state.clicked}
                                helperText={
                                    this.state.badNewUsername && this.state.clicked
                                        ? "Username is not available"
                                        : ""
                                }
                                label="New user name"
                                defaultValue=""
                                onChange={(e): void => {
                                    this.setState({
                                        newUsername: e.target.value
                                    });
                                }}
                            />
                        </div>
                        <div  className={classes.dialog}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.underwearRemind}
                                        color="primary"
                                        inputProps={{ "aria-label": "secondary checkbox" }}
                                        onChange={(event): void => {
                                            return this.setState({ underwearRemind: event.target.checked });
                                        }
                                        }
                                    />
                                }
                                label="Remind to change underwear"
                            />
                        </div>
                        <div  className={classes.dialog}>
                            <Button
                                onClick={this.changeName}
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Submit
                            </Button>
                        </div>
                    </Card>
                </Dialog>
                <Paper>
                <Grid justify='center' container style={{ backgroundColor:'#e3dfc8', flexGrow: 2 }}>
                    <Grid item >
                    <div className={classes.leftCard}>
                        <EditEvents
                            showEdit={true}
                            sessionToken={this.props.sessionToken}
                            child={this.props.child}
                        />
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <div style={{marginTop:'5px',display:'inline-block'}}onClick={() => this.setState({ openNewClothes: true })}>
                            <CardContent style={{color:'#96bb7c'}}>
                                <Add fontSize='large' /><GiClothes size={'2.5em'} />
                            </CardContent>
                        </div>
                        <Dialog fullWidth open={this.state.openNewClothes} onClose={this.handleCloseNewClothes}>
                                <NewClothes closeNewClothes={this.closeNewClothes} getAllClothes={this.getAllClothes} child={this.props.child} sessionToken={this.props.sessionToken} showClothes={false} />
                        </Dialog>
                        <ShowClothes setActiveClothes={this.setActiveClothes} setOpenClothes={this.setOpenClothes} clothes={this.state.clothes} sessionToken={this.props.sessionToken} delete={true} child={this.props.child} getAllClothes={this.getAllClothes} />

                        <EditClothes clothes={this.state.activeClothes} setOpenClothes={this.setOpenClothes} getAllClothes={this.getAllClothes} child={this.props.child} sessionToken={this.props.sessionToken} open={this.state.openEditClothes} />

                    </Grid>

                </Grid>
                </Paper>

                

            </div>

        )
    }
}

export default withStyles(styles)(EditChild);