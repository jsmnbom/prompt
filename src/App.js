import React, {Component, Fragment} from 'react';
import logo from './img/logo.svg';
import withRoot from "./withRoot";
import {withStyles} from "@material-ui/core/styles";
import {AppBar, Toolbar, Typography, IconButton, Menu, MenuItem} from "@material-ui/core";
import {MoreVert, Launch} from "@material-ui/icons";
import {Switch, Route} from "react-router-dom";
import Welcome from "./Welcome";
import Setup from "./Setup";
import Draw from "./Draw";

const styles = theme => ({
    appBar: {
        position: 'relative'
    },
    appLogo: {
        animation: 'App-logo-spin infinite 20s linear',
        height: theme.spacing.unit * 4
    },
    '@keyframes App-logo-spin': {
        from: {transform: 'rotate(0deg)'},
        to: {transform: 'rotate(360deg)'}
    },
    title: {
        flexGrow: 1
    },
    toolbar: {
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit
    }
});


class App extends Component {
    state = {
        menuAnchor: null,
        extraMenuItems: [],
        extraToolbarItems: null
    };


    handleMenuOpen = event => {
        this.setState({menuAnchor: event.currentTarget});
    };

    handleMenuClose = (then) => () => {
        this.setState({menuAnchor: null});
        if (then) then();
    };

    setExtraMenuItems(menuItems) {
        console.log(menuItems);
        this.setState({extraMenuItems: menuItems});
    }

    setExtraToolbarItems(toolbarItems) {
        console.log(toolbarItems);
        this.setState({extraToolbarItems: toolbarItems});
    }

    render() {
        const {classes} = this.props;
        const {menuAnchor, extraMenuItems, extraToolbarItems} = this.state;
        const open = Boolean(menuAnchor);

        const setItems = {
            setExtraMenuItems: this.setExtraMenuItems.bind(this),
            setExtraToolbarItems: this.setExtraToolbarItems.bind(this)
        };

        return (
            <Fragment>
                <AppBar position="absolute" color="default" className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <img src={logo} className={classes.appLogo} alt="Logo"/>
                        <Typography variant="title" color="inherit" noWrap className={classes.title}>
                            Prompt generator
                        </Typography>
                        {extraToolbarItems}
                        <IconButton
                            aria-owns={open ? 'menu-appbar' : null}
                            aria-haspopup="true"
                            onClick={this.handleMenuOpen}
                            color="inherit"
                        >
                            <MoreVert/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={menuAnchor}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={this.handleMenuClose(null)}
                        >
                            {extraMenuItems.map((menuItem) => (
                                <MenuItem
                                    onClick={this.handleMenuClose(menuItem.onClick)}>{menuItem.title}</MenuItem>
                            ))}
                            <MenuItem onClick={this.handleMenuClose(() => {
                                window.open('https://github.com/jsmnbom/prompt')
                            })}>Show source code on Github&nbsp;<Launch style={{fontSize: 18}}/></MenuItem>
                            {/*<MenuItem onClick={this.handleMenuClose(null)}>About</MenuItem>*/}
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route exact path="/" render={() => <Welcome {...setItems}/>}/>
                    <Route path="/setup" render={() => <Setup {...setItems}/>}/>
                    <Route path="/draw" render={() => <Draw {...setItems}/>}/>
                </Switch>
            </Fragment>
        )

    }
}

export default withRoot(withStyles(styles)(App));
