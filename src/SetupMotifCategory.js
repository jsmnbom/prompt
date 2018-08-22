import ButtonBase from "@material-ui/core/ButtonBase";
import Checkbox from '@material-ui/core/Checkbox';
import {grey} from '@material-ui/core/colors';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from "@material-ui/core/Typography";
import classNames from 'classnames';
import React, {Component} from 'react';


const styles = theme => ({
    button: {
        height: 0,
        paddingTop: '56.25%', // 16:9
        width: '100%',
        animation: 'fadein .8s ease-out .2s forwards',
        opacity: 0
    },
    '@keyframes fadein': {
        from: {opacity: '0'},
        to: {opacity: '1'}
    },
    img: {
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    },
    bar: {
        width: '100%',
        height: theme.spacing.unit * 6,
        background: '#000000bb',
        position: 'absolute',
        bottom: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'row'
    },
    switch: {
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    text: {
        flexGrow: 1,
        color: grey[100],
        textAlign: 'left',
        paddingLeft: theme.spacing.unit * 2,
        alignSelf: 'center',
        fontWeight: 300
    },
    greyed: {
        filter: 'grayscale(70%)'
    }
});

class SetupMotifCategory extends Component {
    render() {
        const {classes, image, name, checked, toggle} = this.props;

        const style = {
            backgroundImage: `url("${image}")`,
        };

        return (
            <ButtonBase
                style={style}
                className={classNames(
                    classes.img,
                    classes.button,
                    {
                        [classes.greyed]: !checked
                    }
                )}
                onClick={toggle}
                tabIndex={-1}
            >
                <div className={classes.bar}>
                    <Typography className={classes.text} variant="headline">
                        {name}
                    </Typography>
                    <Checkbox checked={checked} style={checked ? {} : {color: grey[50]}}/>
                </div>
            </ButtonBase>

        );
    }
}

export default withStyles(styles)(SetupMotifCategory)
