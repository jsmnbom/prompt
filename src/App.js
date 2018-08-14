import React, {Component, Fragment} from 'react';
import logo from './img/logo.svg';
import withRoot from "./withRoot";
import {withStyles} from "@material-ui/core/styles";
import {AppBar, Toolbar, Typography} from "../node_modules/@material-ui/core";
import {Switch, Route} from "react-router-dom";
import Welcome from "./Welcome";
import Setup from "./Setup";

const styles = theme => ({
    appBar: {
        position: 'relative'
    },
    appLogo: {
        animation: 'App-logo-spin infinite 20s linear',
        height: theme.spacing.unit * 4
    },
    '@keyframes my-animation': {
        from: {transform: 'rotate(0deg)'},
        to: {transform: 'rotate(360deg)'}
    }
});


class App extends Component {
    render() {
        const {classes} = this.props;
        return (
            <Fragment>
                <AppBar position="absolute" color="default" className={classes.appBar}>
                    <Toolbar>
                        <img src={logo} className={classes.appLogo} alt="Logo"/>
                        <Typography variant="title" color="inherit" noWrap>
                            Prompt generator
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route exact path="/" component={Welcome}/>
                    <Route path="/setup" component={Setup}/>
                </Switch>
            </Fragment>
        )

    }
}

export default withRoot(withStyles(styles)(App));
