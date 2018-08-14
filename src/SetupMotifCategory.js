import React, {Component} from 'react';
import {Card, ButtonBase, Typography, Switch, } from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';


const styles = theme => ({
    card: {
        //maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        padding: '4px 8px'
    },
    switch: {
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
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
            <div>
                <Card className={classes.card}>
                    <ButtonBase
                        focusRipple
                        className={classNames(
                            classes.media,
                            {
                                [classes.greyed]: !checked
                            }
                        )}
                        style={style}
                        onClick={toggle}
                    >
                    </ButtonBase>
                    <div className={classes.content}>
                        <Typography variant="headline" component="h2">
                            {name}
                        </Typography>
                        <Switch
                            checked={checked}
                            onChange={toggle}
                            className={classes.switch}
                            value="checked"
                        />
                    </div>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(SetupMotifCategory)
