import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {LinearProgress, Paper, CircularProgress} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {parse} from "qs";
import moment from "moment";
import {categoryFromName} from "./motifs";
import classNames from 'classnames';
import {sample} from "lodash/collection";

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

class Draw extends Component {
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
            showLoader: false
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions() {
        this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight});
    }

    componentWillMount() {
        this.updateDimensions();
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
        const timePercentLeft = 100 - (((moment().diff(this.state.startTime) / 1000) / this.state.timePer) * 100);

        if (timePercentLeft <= 0) {
            this.restart();
        }

        this.setState({
            timePercentLeft: timePercentLeft
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
        const {currentUrl, currentImageWidth, currentImageHeight, showLoader, windowHeight, windowWidth} = this.state;

        let dimen = {
            height: windowHeight / 2,
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
                        <img src={currentUrl} onLoad={this.handleLoad} style={dimen}
                             className={classNames({[classes.dimmed]: showLoader})}/>
                    )}
                    {showLoader && (
                        <CircularProgress className={classes.loader}/>
                    )}
                </Paper>

            </Fragment>
        )
    }
}

export default compose(
    withStyles(styles),
    withRouter,
)(Draw);
