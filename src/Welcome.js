import {Component} from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 6,
            padding: theme.spacing.unit * 3,
        },
    },
    button: {
        marginTop: theme.spacing.unit * 2,
        textAlign: 'center'
    },
    text: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2
    }
});

class Welcome extends Component {
    componentWillMount() {
        this.setToolbarButtons();
    }

    setToolbarButtons() {
        this.props.setExtraToolbarItems();
    }

    render() {
        const {classes, preloadSetup} = this.props;
        return (
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="display1" align="center" gutterBottom>
                        Welcome to prompt generator
                    </Typography>
                    <Typography gutterBottom>
                        Lorem ipsum dolor sit amet, graecis nusquam ponderum id his, ei omnes discere gloriatur eos. Mei
                        iisque consulatu ex, id vis summo constituam, vocent deterruisset et mea. No congue volumus vel,
                        tempor pericula pri an. Ne repudiare conclusionemque vix. Numquam suavitate ad pro, vis senserit
                        petentium adipiscing ex.
                    </Typography>
                    <Typography gutterBottom>
                        Falli repudiare reprehendunt est et. Vim error dolores an, democritum consectetuer vix et.
                        Molestie
                        voluptatum has ad, et eos movet essent tractatos. Te eos veniam invidunt lobortis.
                    </Typography>
                    <Grid container justify="center">
                        <Grid item>
                            <Button component={Link}
                                    to="/setup"
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onMouseOver={() => preloadSetup()}>
                                Lets get started
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(Welcome);