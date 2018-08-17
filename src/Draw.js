import React, {Fragment, PureComponent} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {LinearProgress, Paper, CircularProgress, IconButton, Tooltip, Toolbar, Button} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {parse} from "qs";
import moment from "moment";
import {categoryFromName} from "./motifs";
import classNames from 'classnames';
import {sample} from "lodash/collection";
import {Pause, PlayArrow, Copyright, SkipNext, Build} from "@material-ui/icons";
import DrawCreditDialog from "./CreditDialog";

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
            currentImage: null,
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
            if (window.innerWidth > theme.breakpoints.values.sm && landscape) appBarHeight = 48;
            if (window.innerWidth > theme.breakpoints.values.md) appBarHeight = 64;

            const timerHeight = theme.spacing.unit;
            const topPadding = theme.spacing.unit * 2;
            const bottomBar = renderBottomBar ? appBarHeight : 0;

            const otherHeight = appBarHeight + timerHeight + topPadding + bottomBar;

            let imgHeight = (window.innerHeight - otherHeight) * 0.75; // Dedicate 3/4 to image
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
        this.updateDimensions({
            startTime: moment(),
            loading: false,
            currentImageWidth: img.target.naturalWidth,
            currentImageHeight: img.target.naturalHeight,
            renderLoader: false
        });
    };

    render() {
        const {classes} = this.props;
        const {currentImage, currentUrl, renderLoader, renderImageWidth, renderImageHeight, renderBottomBar} = this.state;

        const imgStyle = {
            width: renderImageWidth,
            height: renderImageHeight
        };

        return (
            <Fragment>
                <LinearProgress color="secondary" variant="determinate" className={classes.timeBar}
                                value={this.state.timePercentLeft} classes={{bar: classes.timeInnerBar}}/>
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
