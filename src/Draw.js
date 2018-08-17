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
    timeInnnerBar: {
        transition: 'none'
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
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
        console.log('constructor');
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
        console.log('pause toggle', moment().diff(this.state.startTime) - this.state.pausedAt);
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
        console.log(this.state.pausedAt);
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
        console.log(img.target);
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
        const {classes} = this.props;
        const {currentImage, currentUrl, currentImageWidth, currentImageHeight, showLoader, windowHeight, windowWidth} = this.state;

        let dimen = {
            height: windowHeight / 2, // TODO: Take appbar height and such into consideration
            width: (currentImageWidth / currentImageHeight) * (windowHeight / 2)
        };
        if (dimen.width + 8/*TODO: THEME*/ * 4 >= windowWidth) {
            dimen = {
                height: (currentImageHeight / currentImageWidth) * (windowWidth - 8 * 4),
                width: windowWidth - 8 * 4
            }
        }

        return (
            <Fragment>
                <LinearProgress color="secondary" variant="determinate" className={classes.timeBar}
                                value={this.state.timePercentLeft} classes={{bar: classes.timeInnnerBar}}/>
                <Paper className={classes.paper} style={dimen}>
                    {currentUrl && (
                        <Fragment>
                            <img src={currentUrl} onLoad={this.handleLoad} style={dimen}
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
    withStyles(styles),
    withRouter,
)(Draw);
