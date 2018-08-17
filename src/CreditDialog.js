import React, {Component, Fragment} from 'react';
import {Dialog, DialogTitle, IconButton, DialogContent, Typography} from '@material-ui/core';
import {Close} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import {compose} from "recompose";
import withWidth, {isWidthDown} from '@material-ui/core/withWidth';
import BY from './img/by.svg'
import CC from './img/cc.svg'
import NC from './img/nc.svg'
import ND from './img/nd.svg'
import SA from './img/sa.svg'
import ZERO from './img/zero.svg'
import categories from "./motifs";

const styles = theme => ({
    CCIcon: {
        height: theme.spacing.unit * 4,
        margin: theme.spacing.unit / 2
    },
    titleOuter: {
        display: 'flex',
        alignItems: 'center',
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 3
    },
    titleInner: {
        flexGrow: 1
    }
});

const ICONS = {
    BY: BY,
    CC: CC,
    NC: NC,
    ND: ND,
    SA: SA,
    ZERO: ZERO
};

const LICENSES = {
    1: {
        name: 'Creative Commons Attribution-NonCommercial-ShareAlike License',
        url: 'https://creativecommons.org/licenses/by-nc-sa/2.0/',
        icons: ['BY', 'NC', 'SA']
    },
    2: {
        name: 'Creative Commons Attribution-NonCommercial License',
        url: 'https://creativecommons.org/licenses/by-nc/2.0/',
        icons: ['BY', 'NC']
    },
    3: {
        name: 'Creative Commons Attribution-NonCommercial-NoDerivs License',
        url: 'https://creativecommons.org/licenses/by-nc-nd/2.0/',
        icons: ['BY', 'NC', 'ND']
    },
    4: {
        name: 'Creative Commons Attribution License',
        url: 'https://creativecommons.org/licenses/by/2.0/',
        icons: ['BY']
    },
    5: {
        name: 'Creative Commons Attribution-ShareAlike License',
        url: 'https://creativecommons.org/licenses/by-sa/2.0/',
        icons: ['BY', 'SA']
    },
    6: {
        name: 'Creative Commons Attribution-NoDerivs License',
        url: 'https://creativecommons.org/licenses/by-nd/2.0/',
        icons: ['BY', 'ND']
    },
    9: {
        name: 'Public Domain Dedication (CC0)',
        url: 'https://creativecommons.org/publicdomain/zero/1.0/',
        icons: ['ZERO']
    },
};

class CreditDialog extends Component {
    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const {classes, currentImage, width, ...other} = this.props;
        let images = [];

        if (currentImage) {
            images = [{
                name: 'Image',
                image: currentImage
            }];
        } else {
            images = categories.map(({name, images, thumb}) => ({name: `${name} thumbnail`, image: images[thumb]}));
        }

        return (
            <Dialog onClose={this.handleClose}
                    fullScreen={isWidthDown('sm', width)}
                    aria-labelledby="credit-dialog-title"
                    className={classes.dialog}
                    {...other}>
                <DialogTitle disableTypography id="credit-dialog-title" className={classes.titleOuter}>
                    <Typography variant="display2" className={classes.titleInner}>
                        Credits
                    </Typography>
                    <IconButton onClick={this.handleClose}>
                        <Close/>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {images.map(({name, image}) => (
                        <Fragment key={name}>
                            <Typography variant="display1">
                                {name}
                            </Typography>
                            <Typography>
                                <a href={`https://flickr.com/${image.owner}/${image.id}`}
                                   target="_blank">{image.title}</a>
                                {' '}
                                by
                                {' '}
                                <a href={`https://flickr.com/${image.owner}`}
                                   target="_blank">{image.ownername}</a>
                                {' '}
                                is licensed according to
                                {' '}
                                <a href={LICENSES[image.license].url}
                                   target="_blank">{LICENSES[image.license].name}</a>
                                .
                            </Typography>
                            {LICENSES[image.license].icons.map((icon) => (
                                <img key={icon} src={ICONS[icon]} className={classes.CCIcon} alt={icon}/>
                            ))}
                        </Fragment>
                    ))}
                </DialogContent>
            </Dialog>
        )
    }
}

export default compose(
    withStyles(styles),
    withWidth()
)(CreditDialog);
