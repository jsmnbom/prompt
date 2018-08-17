import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row'
    },
    color: {
        flexGrow: 1
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
                        style.flexBasis = `${palette.colorWidths[i]*100}%`
                    }
                    return (
                        <div key={i} style={style} className={classes.color}/>
                    )
                })}
            </div>
        )
    }
}

export default withStyles(styles)(Palette)
