import React from 'react';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Card from '@material-ui/core/Card'
import Box from '@material-ui/core/Box'
import { Weather } from '../../types'


interface HeaderProps {
    clearToken: () => void;
}
interface HeaderState {

}

export default class Header extends React.Component<HeaderProps, HeaderState>{
    constructor(props: HeaderProps) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
                <AppBar 
                >
                <Toolbar
                    style={{width:'100%',margin:'auto'}}
                    // container
                    // direction="row"
                    // alignItems="center"
                >   
                    <Typography variant='h2'>Outfitter</Typography>
                    
<Box style={{margin:"auto"}}>
<Button onClick={this.props.clearToken}>Logout</Button>

</Box>
                    
                    </Toolbar>
                </AppBar>
                
        )
    }
}
