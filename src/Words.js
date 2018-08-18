import React, {Component, Fragment} from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import sampleSize from "lodash/sampleSize";

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
        fontWeight: 400,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '50%',
        [theme.breakpoints.up(400)]: {
            width: '30%'
        },
        [theme.breakpoints.up('sm')]: {
            width: '20%'
        },
    },
    tooltip: {
        fontSize: '150%'
    }
});

class Words extends Component {
    componentWillMount() {
        this.setState({
            backgrounds: sampleSize(['f0', 'e6', 'dc', 'd2', 'c8'], this.props.words.length).map((x) => `#${x}${x}${x}`)
        })
    }

    render() {
        const {classes, words} = this.props;

        return (
            <div className={classes.container}>
                {words.map((word, i) => {
                    return (
                        <Fragment key={i}>
                            <Tooltip title={word} classes={{tooltip: classes.tooltip}}>
                                <Typography variant="title" className={classes.word}
                                            style={{backgroundColor: this.state.backgrounds[i]}}>
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
