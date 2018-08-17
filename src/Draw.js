import React, {Fragment, PureComponent} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {LinearProgress, Paper, CircularProgress, IconButton, Tooltip} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {parse} from "qs";
import moment from "moment";
import {categoryFromName} from "./motifs";
import classNames from 'classnames';
import {sample} from "lodash/collection";
import {Pause, PlayArrow, Copyright, SkipNext} from "@material-ui/icons";
import DrawCreditDialog from "./DrawCreditDialog";

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
            showLoader: false,
            pausedAt: null, //secs since start at pause time,
            creditDialogOpen: false
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions() {
        this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight});
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
                <Tooltip title="Skip">
                    <IconButton onClick={() => (this.restart())}>
                        <SkipNext/>
                    </IconButton>
                </Tooltip>
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
                    showLoader: true
                });
            }, 1000)
        });
    }

    handleLoad = (img) => {
        clearTimeout(this.loadingTimer);
        this.setState({
            startTime: moment(),
            loading: false,
            currentImageWidth: img.target.naturalWidth,
            currentImageHeight: img.target.naturalHeight,
            showLoader: false
        });
    };

    render() {
        const {classes, theme} = this.props;
        const {currentImage, currentUrl, currentImageWidth, currentImageHeight, showLoader, windowHeight, windowWidth} = this.state;

        let appBarHeight = 56;
        if (window.matchMedia(`${theme.breakpoints.up('xs')} and (orientation: landscape)`).matches) appBarHeight = 48;
        if (window.matchMedia(`${theme.breakpoints.up('sm')}`).matches) appBarHeight = 64;

        const topBarHeightAndMargin = (theme.spacing.unit + appBarHeight + theme.spacing.unit * 2);

        let imgHeight = (windowHeight - topBarHeightAndMargin) * 0.75; // Dedicate 3/4 to image
        let imgWidth = (currentImageWidth / currentImageHeight) * imgHeight;
        if (imgWidth + theme.spacing.unit * 4 >= windowWidth) {
            imgWidth = windowWidth - theme.spacing.unit * 4;
            imgHeight = (currentImageHeight / currentImageWidth) * imgWidth;
        }

        const imgStyle = {
            width: imgWidth,
            height: imgHeight
        };

        return (
            <Fragment>
                <LinearProgress color="secondary" variant="determinate" className={classes.timeBar}
                                value={this.state.timePercentLeft} classes={{bar: classes.timeInnerBar}}/>
                <Paper className={classes.paper} style={imgStyle}>
                    {currentUrl && (
                        <Fragment>
                            <img src={currentUrl} onLoad={this.handleLoad} style={imgStyle}
                                 className={classNames({[classes.dimmed]: showLoader})}
                                 alt={`${currentImage.title} by ${currentImage.ownername} on Flickr.com`}/>
                        </Fragment>
                    )}
                    {showLoader && (
                        <CircularProgress className={classes.loader}/>
                    )}
                </Paper>
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
