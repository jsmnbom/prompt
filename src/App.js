import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import withStyles from "@material-ui/core/styles/withStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Launch from "@material-ui/icons/Launch";
import MoreVert from "@material-ui/icons/MoreVert";
import React, {Component, Fragment} from 'react';
import Loadable from 'react-loadable';
import Link from "react-router-dom/es/Link";
import Route from "react-router-dom/es/Route";
import Switch from "react-router-dom/es/Switch";
import {compose} from "recompose";
import logo from './img/logo.svg';
import Loading from "./Loading";
import Welcome from "./Welcome";
import withRoot from "./withRoot";


const Setup = Loadable({
    loader: () => import('./Setup'),
    loading: Loading,
});

const Draw = Loadable({
    loader: () => import('./Draw'),
    loading: Loading,
});

const Debug = Loadable({
    loader: () => import('./Debug'),
    loading: Loading,
});

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
    constructor(props) {
        super(props);
        this.state = {
            menuAnchor: null,
            extraMenuItems: [],
            extraToolbarItems: null
        };
    }

    handleMenuOpen = event => {
        this.setState({menuAnchor: event.currentTarget});
    };

    handleMenuClose = (then) => () => {
        this.setState({menuAnchor: null});
        if (then) then();
    };

    setExtraMenuItems(menuItems) {
        this.setState({extraMenuItems: menuItems});
    }

    setExtraToolbarItems(toolbarItems) {
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
                            {process.env.NODE_ENV === "development" && (
                                <MenuItem component={Link} to={"/debug"}>Debugging menu</MenuItem>
                            )}
                            {/*<MenuItem onClick={this.handleMenuClose(null)}>About</MenuItem>*/}
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route exact path="/" render={() => <Welcome {...setItems} preloadSetup={Setup.preload}/>}/>
                    <Route path="/setup" render={() => <Setup {...setItems} preloadDraw={Draw.preload}/>}/>
                    <Route path="/draw" render={() => <Draw {...setItems}/>}/>
                    <Route path="/debug" render={() => <Debug {...setItems}/>}/>
                </Switch>
            </Fragment>
        )
    }
}

export default compose(
    withRoot,
    withStyles(styles)
)(App);
