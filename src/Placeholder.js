import React, {Component} from "react";
!!!
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
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
    }
});

const steps = ['General', 'Motifs', 'Colours', 'Text'];

class Placeholder extends Component {
    render() {
        const {step, classes} = this.props;
        return (
            <div className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="title" gutterBottom>
                        {steps[step]}
                    </Typography>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(Placeholder)