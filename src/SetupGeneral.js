import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Paper, Typography, FormControlLabel, RadioGroup, Radio, FormControl} from "@material-ui/core";

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
    group: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    radio: {
        [theme.breakpoints.up('xs')]: {
            width: '40%'
        },
        [theme.breakpoints.up('400')]: {
            width: '25%'
        },
        [theme.breakpoints.up('sm')]: {
            width: '20%'
        },
        [theme.breakpoints.up('md')]: {
            width: '15%'
        },
    }
});

class SetupGeneral extends Component {
    state = {
        timePer: String(60 * 5)
    };

    handleChange = event => {
        this.setState({ timePer: event.target.value });
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.layout}>
                <Paper className={classes.paper}>
                    <FormControl component="fieldset">
                        <Typography variant="title" gutterBottom>
                            Time per prompt
                        </Typography>
                        <RadioGroup
                            aria-label="Time per propmt"
                            name="timePer"
                            className={classes.group}
                            value={this.state.timePer}
                            onChange={this.handleChange}
                        >
                            {[
                                ['inf', 'Infinite'],
                                [30, '30 sec.'],
                                [60, '1 min'],
                                [60 * 2, '2 min'],
                                [60 * 3, '3 min'],
                                [60 * 4, '4 min'],
                                [60 * 5, '5 min'],
                                [60 * 10, '10 min'],
                                [60 * 15, '15 min'],
                                [60 * 30, '30 min'],
                                [60 * 45, '45 min'],
                                [60 * 60, '60 min'],
                            ].map(([value, label]) => {
                                return (
                                    <FormControlLabel value={String(value)} control={<Radio/>}
                                                      label={label} className={classes.radio}/>
                                )
                            })}
                        </RadioGroup>
                    </FormControl>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(SetupGeneral)
