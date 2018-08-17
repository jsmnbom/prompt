import React, {Fragment, PureComponent} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {LinearProgress, Paper, CircularProgress, IconButton, Tooltip, Toolbar, Button} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {parse} from "qs";
import moment from "moment";
import {categoryFromName} from "./data/motifs";
import palettes from "./data/palettes";
import classNames from 'classnames';
import {sample} from "lodash/collection";
import {Pause, PlayArrow, Copyright, SkipNext, Build} from "@material-ui/icons";
import DrawCreditDialog from "./CreditDialog";
import Palette from "./Palette";

const styles = theme => ({
    timeBar: {
        height: theme.spacing.unit
    },
    timeInnerBar: {
        transition: 'none'
    },
    paper: {
        marginTop: theme.spacing.unit * 2,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative'
    },
    loader: {
        display: 'block',
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -theme.spacing.unit * 2.5,
        marginTop: -theme.spacing.unit * 2.5
    },
    dimmed: {
        filter: 'brightness(50%)'
    },
    bottomBar: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 100
    },
    bottomToolbar: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    palettePaper: {
        display: 'flex',
        height: theme.spacing.unit * 6,
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    }
});

class Draw extends PureComponent {
    mainTimer = null;
    loadingTimer = null;

    constructor(props) {
        super(props);
        const setup = parse(this.props.location.search, {ignoreQueryPrefix: true});
        this.state = {
            timePer: parseInt(setup.timePer, 10),
            timePercentLeft: 100,
            motifCategories: setup.motifCategories,
            maxQuality: setup.maxQuality,
            showPalette: setup.showPalette,
            currentImageHeight: 1,
            currentImageWidth: 1,
            renderLoader: false,
            pausedAt: null, //secs since start at pause time,
            creditDialogOpen: false
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions(extraState) {
        this.setState((prevState) => {
            const {theme} = this.props;
            const currentImageWidth = (extraState && extraState.currentImageWidth) || prevState.currentImageWidth;
            const currentImageHeight = (extraState && extraState.currentImageHeight) || prevState.currentImageHeight;

            const landscape = window.matchMedia('(orientation: landscape)').matches;

            const renderBottomBar = (window.innerWidth < theme.breakpoints.values.sm) && !landscape;

            let appBarHeight = 56;
            if (window.innerWidth > theme.breakpoints.values.xs && landscape) appBarHeight = 48;
            if (window.innerWidth > theme.breakpoints.values.sm) appBarHeight = 64;

            const timerHeight = theme.spacing.unit;
            const topMargin = theme.spacing.unit * 2;
            const bottomMargin = theme.spacing.unit * 2;
            const bottomBar = renderBottomBar ? appBarHeight : 0;

            let otherHeight = appBarHeight + timerHeight + topMargin + bottomMargin + bottomBar;

            if (this.state.showPalette) {
                const paletteHeight = theme.spacing.unit * 6;
                const paletteMargin = theme.spacing.unit * 2;
                otherHeight += paletteHeight + paletteMargin;
            }

            let imgHeight = (window.innerHeight - otherHeight);
            let imgWidth = (currentImageWidth / currentImageHeight) * imgHeight;
            if (imgWidth + theme.spacing.unit * 4 >= window.innerWidth) {
                imgWidth = window.innerWidth - theme.spacing.unit * 4;
                imgHeight = (currentImageHeight / currentImageWidth) * imgWidth;
            }

            return {
                ...extraState,
                renderImageWidth: imgWidth,
                renderImageHeight: imgHeight,
                renderBottomBar
            }
        }, () => {
            this.setToolbarButtons();
        });
    }

    togglePause = () => {
        this.setState((prevState) => {
            if (prevState.pausedAt === null) {
                return {pausedAt: (moment().diff(prevState.startTime))};
            } else {
                return {
                    pausedAt: null,
                    startTime: prevState.startTime.add(moment().diff(this.state.startTime) - this.state.pausedAt)
                }
            }
        }, () => {
            this.setToolbarButtons();
        });
    };

    componentWillMount() {
        this.updateDimensions();
        this.setToolbarButtons();
    }

    setToolbarButtons() {
        this.props.setExtraToolbarItems(
            <Fragment>
                {!this.state.renderBottomBar && (
                    <Fragment>
                        <Tooltip title="Back to settings">
                            <IconButton onClick={() => (this.restart())}>
                                <Build/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Skip">
                            <IconButton onClick={() => (this.restart())}>
                                <SkipNext/>
                            </IconButton>
                        </Tooltip>
                    </Fragment>
                )}
                <Tooltip title="Show image and palette credit">
                    <IconButton onClick={this.openCreditDialog}>
                        <Copyright/>
                    </IconButton>
                </Tooltip>
                <IconButton onClick={this.togglePause}>
                    {this.state.pausedAt === null ? <Pause/> : <PlayArrow/>}
                </IconButton>
            </Fragment>
        );
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.mainTimer = setInterval(this.progress, 200);
        this.restart()
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
        clearInterval(this.mainTimer);
        clearTimeout(this.loadingTimer);
    }

    progress = () => {
        if (!this.state.startTime || this.state.loading) return;
        const milliSecPassed = this.state.pausedAt || moment().diff(this.state.startTime);
        const timePercentLeft = 100 - (((milliSecPassed / 1000) / this.state.timePer) * 100);

        if (timePercentLeft <= 0) {
            this.restart();
        }

        this.setState({
            timePercentLeft: timePercentLeft
        })
    };

    openCreditDialog = () => {
        this.setState({
            creditDialogOpen: true
        })
    };

    handleCreditDialogClose = () => {
        this.setState({
            creditDialogOpen: false
        })
    };

    restart() {
        const image = sample(categoryFromName(sample(this.state.motifCategories)).images);
        let allowed = ['url_h', 'url_b', 'url_z'].slice('hbz'.indexOf(this.state.maxQuality));
        let url;
        for (let v of allowed) {
            url = image[v];
            if (url) break;
        }
        this.setState({
            currentImage: image,
            currentUrl: url,
            loading: true
        }, () => {
            this.loadingTimer = setTimeout(() => {
                this.setState({
                    renderLoader: true
                });
            }, 1000)
        });
    }

    handleLoad = (img) => {
        clearTimeout(this.loadingTimer);

        const palette = this.state.showPalette ? sample(palettes.palettes) : null;

        this.updateDimensions({
            startTime: moment(),
            loading: false,
            currentImageWidth: img.target.naturalWidth,
            currentImageHeight: img.target.naturalHeight,
            renderLoader: false,
            currentPalette: palette
        });
    };

    render() {
        const {classes} = this.props;
        const {currentImage, currentUrl, currentPalette, renderLoader, renderImageWidth, renderImageHeight, renderBottomBar} = this.state;

        const imgStyle = {
            width: renderImageWidth,
            height: renderImageHeight
        };

        return (
            <Fragment>
                <LinearProgress color="secondary" variant="determinate" className={classes.timeBar}
                                value={this.state.timePercentLeft} classes={{bar: classes.timeInnerBar}}/>
                {currentPalette && (
                    <Paper className={classNames(classes.paper, classes.palettePaper)}>
                        <Palette palette={currentPalette}/>
                    </Paper>
                )}
                <Paper className={classes.paper} style={imgStyle}>
                    {currentUrl && (
                        <Fragment>
                            <img src={currentUrl} onLoad={this.handleLoad} style={imgStyle}
                                 className={classNames({[classes.dimmed]: renderLoader})}
                                 alt={`${currentImage.title} by ${currentImage.ownername} on Flickr.com`}/>
                        </Fragment>
                    )}
                    {renderLoader && (
                        <CircularProgress className={classes.loader}/>
                    )}
                </Paper>

                {renderBottomBar && (
                    <Paper className={classes.bottomBar} elevation={24}>
                        <Toolbar className={classes.bottomToolbar}>
                            <Button size="small">
                                <Build/>
                                Setup
                            </Button>
                            <Button size="small" onClick={() => (this.restart())}>
                                Skip
                                <SkipNext/>
                            </Button>
                        </Toolbar>
                    </Paper>
                )}
                <DrawCreditDialog
                    currentImage={currentImage}
                    open={this.state.creditDialogOpen}
                    onClose={this.handleCreditDialogClose}
                />
            </Fragment>
        )
    }
}

export default compose(
    withStyles(styles, {withTheme: true}),
    withRouter,
)(Draw);
