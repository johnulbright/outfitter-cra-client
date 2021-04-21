import React from 'react'
import { Redirect,Link } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import { GiClothes } from "react-icons/gi";
import Add from '@material-ui/icons/Add'
import { ChildKeys, Clothes } from '../../types'
import ShowClothes from '../clothes/ShowClothes'
import EditClothes from '../clothes/EditClothes'
import EditEvents from '../events/EditEvents'
import NewClothes from '../clothes/NewClothes'
import APIURL from '../../helpers/environment'

interface EditChildProps {
    child: ChildKeys;
    sessionToken: string

}

interface EditChildState {
    openEditClothes: boolean;
    openNewClothes: boolean
    activeClothes: Clothes | null
    clothes: Clothes[]

}

export default class EditChild extends React.Component<EditChildProps, EditChildState>{
    constructor(props: EditChildProps) {
        super(props)
        this.state = {
            openEditClothes: false,
            openNewClothes: false,
            clothes: [],
            activeClothes: null,
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
        console.log(clothes)
        this.setState({ clothes: clothes })
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
    render() {
        if (this.props.child.id === -1) {
            return (
                <Redirect to={"/"} />
            )
        }
        return (
            <div>
                Edit Child
                <h3>Editing {this.props.child.name}</h3>

                <Grid container style={{ flexGrow: 1 }}>
                    <Grid item xs={6}>
    
                        <EditEvents 
                            showEdit={true} 
                            sessionToken={this.props.sessionToken} 
                            child={this.props.child} 
                           />
                    </Grid>
                    <Grid item xs={6}>
                        <Card onClick={() => this.setState({ openNewClothes: true })}>
                            <CardContent>
                                <Add fontSize='large' /><GiClothes size={'2.5em'} />
                            </CardContent>
                        </Card>
                        <Dialog fullWidth open={this.state.openNewClothes} onClose={this.handleCloseNewClothes}>
                            <Box>
                                <NewClothes closeNewClothes={this.closeNewClothes} getAllClothes={this.getAllClothes} child={this.props.child} sessionToken={this.props.sessionToken} showClothes={false} />
                            </Box>
                        </Dialog>
                        <ShowClothes setActiveClothes={this.setActiveClothes} setOpenClothes={this.setOpenClothes} clothes={this.state.clothes} sessionToken={this.props.sessionToken} delete={true} child={this.props.child} getAllClothes={this.getAllClothes} />

                        <EditClothes clothes={this.state.activeClothes} setOpenClothes={this.setOpenClothes} getAllClothes={this.getAllClothes} child={this.props.child} sessionToken={this.props.sessionToken} open={this.state.openEditClothes} />

                    </Grid>

                </Grid>
                <Link to="/"><Button>Back</Button></Link>
            </div>

        )
    }
}