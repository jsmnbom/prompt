import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import React, {Component, Fragment} from 'react';

const styles = theme => ({
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row'
    },
    color: {
        flexGrow: 1,
        transition: 'background-color .5s ease-out, flex-basis .5s ease-out'
    },
    tooltip: {
        fontSize: '150%'
    }
});

class Palette extends Component {
    render() {
        const {classes, palette} = this.props;

        return (
            <div className={classes.container}>
                {palette.colors.map((color, i) => {
                    const style = {
                        backgroundColor: `#${color}`
                    };
                    if (palette.colorWidths) {
                        style.flexBasis = `${palette.colorWidths[i] * 100}%`
                    }
                    return (
                        <Fragment key={i}>
                            <Tooltip title={`#${color}`} classes={{tooltip: classes.tooltip}}>
                                <div style={style} className={classes.color}/>
                            </Tooltip>
                        </Fragment>
                    )
                })}
            </div>
        )
    }
}

export default withStyles(styles)(Palette)
