import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {LinearProgress, Paper} from '@material-ui/core';
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {parse} from "qs";
import moment from "moment";
import {categoryFromName} from "./motifs";
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
            currentImage: null,
            currentImageDim: {height: 0, width: 0},
            showLoader: false
        };

    }

    componentDidMount() {
        this.mainTimer = setInterval(this.progress, 200);
        this.restart()
    }

    componentWillUnmount() {
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
        this.setState({
            currentImage: this.chooseImage(),
            loading: true
        }, () => {
            this.loadingTimer = setTimeout(() => {
                this.setState({
                    showLoader: true
                });
            }, 1000)
        });
    }

    chooseImage() {
        return sample(categoryFromName(sample(this.state.motifCategories)).images)
    }

    handleLoad = (img) => {
        console.log(img.target);
        clearTimeout(this.loadingTimer);
        this.setState({
            startTime: moment(),
            loading: false,
            currentImageDim: {
                width: img.target.scrollWidth,
                height: img.target.scrollHeight
            },
            showLoader: false
        });
    };

    render() {
        const {classes} = this.props;
        const {currentImage, currentImageDim, showLoader} = this.state;

        let dim = {
            height: window.innerHeight / 2,
            width: (currentImageDim.width / currentImageDim.height) * (window.innerHeight / 2)
        };
        if (dim.width + 8/*THEME*/ * 4 >= window.innerWidth) {
            dim = {
                height: (currentImageDim.height / currentImageDim.width) * (window.innerWidth - 8 * 4),
                width: window.innerWidth - 8 * 4
            }
        }

        return (
            <Fragment>
                <LinearProgress color="secondary" variant="determinate" className={classes.timeBar}
                                value={this.state.timePercentLeft} classes={{bar: classes.timeInnnerBar}}/>
                <p style={showLoader ? {} : {display: 'none'}}>Loading...</p>
                <Paper className={classes.paper} style={dim}>
                    {this.state.currentImage && (
                        <img src={this.state.currentImage.url_z} onLoad={this.handleLoad} style={dim}/>
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
