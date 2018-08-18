import React, {Fragment, Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import {Link, withRouter} from "react-router-dom";
import {compose} from "recompose";
import {parse, stringify} from "qs";
import dayjs from "dayjs";
import {categoryFromName} from "./data/motifs";
import palettes from "./data/palettes";
import classNames from 'classnames';
import sample from "lodash/sample";
import Pause from "@material-ui/icons/Pause";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Copyright from "@material-ui/icons/Copyright";
import SkipNext from "@material-ui/icons/SkipNext";
import Build from "@material-ui/icons/Build";
import DrawCreditDialog from "./CreditDialog";
import Palette from "./Palette";
import sampleSize from "lodash/sampleSize";
import WORDS from './data/words'
import Words from "./Words";

const makeRepeated = (arr, repeats) =>
    [].concat(...Array.from({length: repeats}, () => arr));

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
        position: 'relative',
        borderRadius: 0
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
    justifiedPaper: {
        display: 'flex',
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    },
    wordsDiv: {
        flexGrow: 1
    },
    palettePaper: {
        height: theme.spacing.unit * 6,
    }
});

class Draw extends Component {
    mainTimer = null;
    loadingTimer = null;

    constructor(props) {
        super(props);
        const setup = parse(this.props.location.search, {ignoreQueryPrefix: true});
        this.state = {
            setup: setup,
            timePer: setup.timePer === 'inf' ? null : parseInt(setup.timePer, 10),
            showPalette: (setup.showPalette === 'true'),
            showWords: (setup.wordCount > 0 && setup.wordCategories && setup.wordCategories.length > 0),
            timePercentLeft: 100,
            currentImageHeight: 1,
            currentImageWidth: 1,
            renderLoader: false,
            pausedAt: null, //secs since start at pause time,
            creditDialogOpen: false
        };
        this.wordsRef = React.createRef();
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

            const timerHeight = this.state.timePer ? theme.spacing.unit : 0;
            const topMargin = theme.spacing.unit * 2;
            const bottomMargin = theme.spacing.unit * 2;
            const bottomBar = renderBottomBar ? appBarHeight : 0;

            let otherHeight = appBarHeight + timerHeight + topMargin + bottomMargin + bottomBar;

            if (this.state.showPalette) {
                const paletteHeight = theme.spacing.unit * 6;
                const paletteMargin = theme.spacing.unit * 2;
                otherHeight += paletteHeight + paletteMargin;
            }

            if (this.state.showWords) {
                const wordsRef = (extraState && extraState.wordsRef) || prevState.wordsRef;
                const wordsHeight = wordsRef ? wordsRef.getBoundingClientRect().height : theme.spacing.unit * 2;
                const wordsMargin = theme.spacing.unit * 2;
                otherHeight += wordsHeight + wordsMargin;
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
                return {pausedAt: (dayjs().diff(prevState.startTime, 'millisecond'))};
            } else {
                return {
                    pausedAt: null,
                    startTime: prevState.startTime.add(dayjs().diff(this.state.startTime, 'millisecond') - this.state.pausedAt, 'millisecond')
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
                    <Tooltip title="Back to settings">
                        <IconButton component={Link} to={{
                            pathname: "/setup",
                            search: stringify(this.state.setup)
                        }}>
                            <Build/>
                        </IconButton>
                    </Tooltip>
                )}
                {(!this.state.renderBottomBar && this.state.timePer) && (
                    <Tooltip title="Skip">
                        <IconButton onClick={() => (this.restart())}>
                            <SkipNext/>
                        </IconButton>
                    </Tooltip>
                )}
                {(!this.state.renderBottomBar && !this.state.timePer) && (
                    <Tooltip title="Next">
                        <IconButton onClick={() => (this.restart())}>
                            <SkipNext/>
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Show image and palette credit">
                    <IconButton onClick={this.openCreditDialog}>
                        <Copyright/>
                    </IconButton>
                </Tooltip>
                {(this.state.timePer) && (
                    <IconButton onClick={this.togglePause}>
                        {this.state.pausedAt === null ? <Pause/> : <PlayArrow/>}
                    </IconButton>
                )}
            </Fragment>
        );
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        if (this.state.timePer) this.mainTimer = setInterval(this.progress, 200);
        this.restart()
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
        if (this.state.timePer) clearInterval(this.mainTimer);
        clearTimeout(this.loadingTimer);
    }

    progress = () => {
        if (!this.state.startTime || this.state.loading) return;
        const milliSecPassed = this.state.pausedAt || dayjs().diff(this.state.startTime, 'millisecond');
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

    restart = () => {
        if (this.state.loading) return;
        const image = sample(categoryFromName(sample(this.state.setup.motifCategories)).images);
        let allowed = ['url_h', 'url_b', 'url_z'].slice('hbz'.indexOf(this.state.setup.maxQuality));
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
    };

    handleLoad = (img) => {
        clearTimeout(this.loadingTimer);

        const palette = this.state.showPalette ? sample(palettes.palettes) : null;

        let words;

        if (this.state.showWords) {
            let categories = this.state.setup.wordCategories;
            if (categories.length < this.state.setup.wordCount) categories = makeRepeated(categories, Math.ceil(this.state.setup.wordCount / categories.length));
            words = sampleSize(categories, this.state.setup.wordCount).map(x => sample(WORDS.categories[x].words).toLowerCase())
        }

        this.updateDimensions({
            startTime: dayjs(),
            currentWords: words,
            loading: false,
            currentImageWidth: img.target.naturalWidth,
            currentImageHeight: img.target.naturalHeight,
            renderLoader: false,
            currentPalette: palette
        });
    };

    setWordsRef = (element) => {
        this.updateDimensions({
            wordsRef: element
        });
    };

    handleError = (img) => {
        console.log('ERROR', img)
    };

    render() {
        const {classes} = this.props;
        const {currentImage, currentUrl, currentPalette, renderLoader, renderImageWidth, renderImageHeight, renderBottomBar, currentWords} = this.state;

        const imgStyle = {
            width: renderImageWidth,
            height: renderImageHeight
        };

        return (
            <Fragment>
                {(this.state.timePer) && (
                    <LinearProgress color="secondary" variant="determinate" className={classes.timeBar}
                                    value={this.state.timePercentLeft} classes={{bar: classes.timeInnerBar}}/>
                )}

                {currentPalette && (
                    <Paper className={classNames(classes.paper, classes.justifiedPaper, classes.palettePaper)}>
                        <Palette palette={currentPalette}/>
                    </Paper>
                )}

                {currentWords && (
                    <Paper className={classNames(classes.paper, classes.justifiedPaper)}>
                        <div ref={this.setWordsRef} className={classes.wordsDiv}>
                            <Words words={currentWords}/>
                        </div>
                    </Paper>
                )}

                <Paper className={classes.paper} style={imgStyle}>
                    {currentUrl && (
                        <Fragment>
                            <img src={currentUrl} onLoad={this.handleLoad} style={imgStyle}
                                 onError={this.handleError}
                                 className={classNames({[classes.dimmed]: renderLoader})}
                                 alt={`${currentImage.title} by ${currentImage.ownername} on Flickr.com${process.env.NODE_ENV === 'development' ? ` (${currentImage.id})` : ''}`}
                                 title={`${currentImage.title} by ${currentImage.ownername} on Flickr.com${process.env.NODE_ENV === 'development' ? ` (${currentImage.id})` : ''}`}
                            />
                        </Fragment>
                    )}
                    {renderLoader && (
                        <CircularProgress className={classes.loader}/>
                    )}
                </Paper>

                {renderBottomBar && (
                    <Paper className={classes.bottomBar} elevation={24}>
                        <Toolbar className={classes.bottomToolbar}>
                            <Button size="small" component={Link} to={{
                                pathname: "/setup",
                                search: stringify(this.state.setup)
                            }}>
                                <Build/>
                                Setup
                            </Button>
                            {(this.state.timePer) && (
                                <Button size="small" onClick={this.restart}>
                                    Skip
                                    <SkipNext/>
                                </Button>
                            )}
                            {(!this.state.timePer) && (
                                <Button size="small" onClick={this.restart}>
                                    Next
                                    <SkipNext/>
                                </Button>
                            )}
                        </Toolbar>
                    </Paper>
                )}
                <DrawCreditDialog
                    currentPalette={currentPalette}
                    currentImage={currentImage}
                    open={this.state.creditDialogOpen}
                    onClose={this.handleCreditDialogClose}
                />
            </Fragment>
        )
    }
}

export default compose(
    withRouter,
    withStyles(styles, {withTheme: true})
)(Draw);
