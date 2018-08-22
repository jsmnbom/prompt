import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Stepper from "@material-ui/core/Stepper";
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import Copyright from "@material-ui/icons/Copyright";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import {parse, stringify} from "qs";
import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import {compose} from 'recompose';
import DrawCreditDialog from "./CreditDialog";
import categories from './data/motifs'
import SetupGeneral from "./SetupGeneral";
import SetupMotifs from "./SetupMotifs";

const styles = theme => ({
    desktopStepper: {
        flexGrow: 1,
        padding: `0 ${theme.spacing.unit * 3}px`,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
    },
    desktopInnerStepper: {
        marginRight: theme.spacing.unit * 4,
        padding: 0,
        flexGrow: 1
    },
    desktopButtons: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    desktopButton: {
        marginLeft: theme.spacing.unit * 2
    },
    mobileStepper: {
        flexGrow: 1,
        padding: 0
    },
    bottomBar: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        zIndex: 100
    },
    bottomToolbar: {
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    }
});

const steps = ['General', 'Motifs'];

class Setup extends Component {
    constructor(props) {
        super(props);
        const setup = parse(this.props.location.search, {ignoreQueryPrefix: true});
        const defaultData = {
            timePer: String(60 * 5),
            showPalette: true,
            wordCategories: [],
            wordCount: 3,
            motifCategories: [],
            maxQuality: 'z',
            imgFilter: 'none'
        };
        const data = {
            timePer: setup.timePer || defaultData.timePer,
            showPalette: setup.showPalette === undefined ? defaultData.showPalette : (setup.showPalette === 'true'),
            wordCategories: setup.wordCategories || defaultData.wordCategories,
            wordCount: parseInt(setup.wordCount, 10) || defaultData.wordCount,
            motifCategories: setup.motifCategories || defaultData.motifCategories,
            maxQuality: setup.maxQuality || defaultData.maxQuality,
            imgFilter: setup.imgFilter || defaultData.imgFilter
        };

        this.state = {
            activeStep: 0,
            data: data,
            wasChanged: {
                words: data.wordCategories !== defaultData.wordCategories || data.wordCount !== defaultData.wordCount,
                advanced: data.maxQuality !== defaultData.maxQuality
            },
            valid: false,
            errMsg: '',
            creditDialogOpen: false
        };
    }

    componentWillMount() {
        this.setToolbarButtons();
        const preload = categories.filter(({thumb}) => Boolean(thumb)).map((cat) => {
            let img = new Image();
            img.src = cat.thumb.urlBase + cat.thumb.url_z;
            return img;
        });
        console.log(preload);
    }

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

    setToolbarButtons() {
        if (this.state.activeStep === 1) {
            this.props.setExtraToolbarItems(
                <Tooltip title="Show thumbnail credit">
                    <IconButton onClick={this.openCreditDialog}>
                        <Copyright/>
                    </IconButton>
                </Tooltip>
            );
        } else {
            this.props.setExtraToolbarItems();
        }
    }

    updateData = (data, valid, errMsg) => {
        this.setState((prevState) => ({
            data: {
                ...prevState.data,
                ...data
            },
            valid: valid,
            errMsg: errMsg || ''
        }));
    };

    getStepContent = (step) => {
        switch (step) {
            case 0:
                return <SetupGeneral data={this.state.data}
                                     updateData={this.updateData}
                                     wasChanged={this.state.wasChanged}/>;
            case 1:
                return <SetupMotifs data={this.state.data}
                                    updateData={this.updateData}/>;
            default:
                throw new Error('Unknown step');
        }
    };

    handleNext = () => {
        const {activeStep} = this.state;
        if (activeStep + 1 >= steps.length) this.props.preloadDraw();
        this.setState({
            activeStep: activeStep + 1,
            valid: false
        }, () => {
            this.setToolbarButtons();
        });
    };

    handleBack = () => {
        const {activeStep} = this.state;
        this.setState({
            activeStep: activeStep - 1,
            valid: false
        }, () => {
            this.setToolbarButtons();
        });
    };

    render() {
        const {classes} = this.props;
        const {activeStep, data, valid, errMsg} = this.state;

        const nextButtonAttrs = activeStep !== steps.length - 1 ? {
            onClick: this.handleNext
        } : {
            component: Link,
            to: {
                pathname: '/draw',
                search: stringify(data)
            }
        };
        const backButtonAttrs = activeStep !== 0 ? {
            onClick: this.handleBack
        } : {
            component: Link,
            to: "/"
        };

        const stepperWithButtons = isWidthUp("sm", this.props.width) ? (
            // Desktop
            <div className={classes.desktopStepper}>
                <Stepper activeStep={activeStep} className={classes.desktopInnerStepper}>
                    {steps.map(label => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className={classes.desktopButtons}>
                    <Button {...backButtonAttrs} className={classes.desktopButton}>
                        {activeStep === 0 ? 'Abort' : 'Back'}
                    </Button>
                    {/*Wrapped in span so we can trigger tooltips if needed*/}
                    <Tooltip title={valid ? '' : errMsg} placement='top'>
                        <span>
                            <Button {...nextButtonAttrs}
                                    className={classes.desktopButton}
                                    disabled={!valid}
                                    variant="contained" color="primary">
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </span>
                    </Tooltip>
                </div>
            </div>
        ) : (
            // Mobile
            <MobileStepper
                steps={steps.length}
                position="static"
                activeStep={activeStep}
                className={classes.mobileStepper}
                backButton={
                    <Button size="small" {...backButtonAttrs}>
                        <KeyboardArrowLeft/>
                        {activeStep === 0 ? 'Abort' : 'Back'}
                    </Button>
                }
                nextButton={
                    <Tooltip title={valid ? '' : errMsg} placement='top'>
                        <span>
                            <Button size="small" {...nextButtonAttrs} disabled={!valid}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                <KeyboardArrowRight/>
                            </Button>
                        </span>
                    </Tooltip>
                }
            />
        );

        return (
            <main>
                {this.getStepContent(activeStep)}

                <Paper className={classes.bottomBar} elevation={24}>
                    <Toolbar className={classes.bottomToolbar}>
                        {stepperWithButtons}
                    </Toolbar>
                </Paper>
                <DrawCreditDialog
                    open={this.state.creditDialogOpen}
                    onClose={this.handleCreditDialogClose}
                />
            </main>
        );
    }
}

export default compose(
    withStyles(styles),
    withWidth(),
    withRouter
)(Setup)