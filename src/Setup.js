import React, {Component} from 'react';
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    Paper,
    Toolbar,
    MobileStepper,
    Tooltip, IconButton
} from '@material-ui/core';
import {Copyright, KeyboardArrowLeft, KeyboardArrowRight} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import {compose} from 'recompose';
import {Link, withRouter} from "react-router-dom";
import SetupMotifs from "./SetupMotifs";
import SetupGeneral from "./SetupGeneral";
import {parse, stringify} from "qs";
import DrawCreditDialog from "./CreditDialog";

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
        this.state = {
            activeStep: 0,
            data: {
                timePer: setup.timePer || String(60 * 5),
                showPalette: setup.showPalette === undefined ? true : (setup.showPalette === 'true'),
                textCategories: setup.textCategories || [],
                textCount: parseInt(setup.textCount, 10) || 2,
                motifCategories: setup.motifCategories || [],
                maxQuality: setup.maxQuality || 'z'
            },
            valid: false,
            errMsg: '',
            creditDialogOpen: false
        };
    }

    componentWillMount() {
        this.setToolbarButtons();
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
                return <SetupGeneral data={this.state.data} updateData={this.updateData}/>;
            case 1:
                return <SetupMotifs data={this.state.data} updateData={this.updateData}/>;
            default:
                throw new Error('Unknown step');
        }
    };

    handleNext = () => {
        const {activeStep} = this.state;
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