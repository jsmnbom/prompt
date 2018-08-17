import React, {Component, Fragment} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    word: {
        flexGrow: 1,
        textAlign: 'center',
        minWidth: 100
    },
    tooltip: {
        fontSize: '150%'
    }
});

class Words extends Component {
    render() {
        const {classes, words, wordsRef} = this.props;

        return (
            <div className={classes.container}>
                {words.map((word, i) => {
                    return (
                        <Fragment key={i}>
                            <Tooltip title={word} classes={{tooltip: classes.tooltip}}>
                                <Typography variant="title" className={classes.word}>
                                    {word}
                                </Typography>
                            </Tooltip>
                        </Fragment>
                    )
                })}
            </div>
        )
    }
}

export default withStyles(styles)(Words)
