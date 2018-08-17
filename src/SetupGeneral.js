import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ListItemText from "@material-ui/core/ListItemText";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Toolbar from "@material-ui/core/Toolbar";
import ExpandMore from "@material-ui/icons/ExpandMore";
import words from './data/words';

const styles = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        paddingTop: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 3
    },
    group: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    radio: {
        [theme.breakpoints.up('xs')]: {
            width: '40%'
        },
        [theme.breakpoints.up('400')]: {
            width: '25%'
        },
        [theme.breakpoints.up('sm')]: {
            width: '20%'
        },
        [theme.breakpoints.up('md')]: {
            width: '15%'
        },
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    vertical: {
        display: 'flex',
        alignItems: 'center'
    },
    panel: {},
    panelDetails: {
        flexDirection: 'column'
    }
});

const TIMES = [
    ['inf', 'Infinite'],
    [30, '30 sec.'],
    [60, '1 min'],
    [60 * 2, '2 min'],
    [60 * 3, '3 min'],
    [60 * 4, '4 min'],
    [60 * 5, '5 min'],
    [60 * 10, '10 min'],
    [60 * 15, '15 min'],
    [60 * 30, '30 min'],
    [60 * 45, '45 min'],
    [60 * 60, '60 min'],
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class SetupGeneral extends Component {
    constructor(props) {
        super(props);
        this.props.updateData({}, true);
    }

    handleChange = name => event => {
        this.props.updateData({[name]: event.target.value}, true);
    };

    handleChangeChecked = name => event => {
        this.props.updateData({[name]: event.target.checked}, true);
    };

    render() {
        const {classes, data, wasChanged} = this.props;
        const {timePer, showPalette, wordCategories, wordCount, maxQuality} = data;

        return (
            <div className={classes.layout}>
                <ExpansionPanel className={classes.panel} defaultExpanded={true}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                        <Typography variant="title">General</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.panelDetails}>
                        <FormLabel component="legend">How much time per prompt</FormLabel>
                        <RadioGroup
                            aria-label="Time per propmt"
                            name="timePer"
                            className={classes.group}
                            value={timePer}
                            onChange={this.handleChange('timePer')}
                        >
                            {TIMES.map(([value, label]) => {
                                return (
                                    <FormControlLabel
                                        key={String(value)}
                                        value={String(value)}
                                        control={<Radio/>}
                                        label={label}
                                        className={classes.radio}/>
                                )
                            })}
                        </RadioGroup>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel className={classes.panel} defaultExpanded={true}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                        <Typography variant="title">Colours</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.panelDetails}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showPalette}
                                    onChange={this.handleChangeChecked('showPalette')}
                                    value="showPalette"
                                />
                            }
                            label="Show a random colour palette from colourlovers.com"
                        />
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel className={classes.panel} defaultExpanded={wasChanged.words}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                        <Typography variant="title">Words</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.panelDetails}>
                        <FormControl>
                            <Select
                                native
                                value={wordCount}
                                onChange={this.handleChange('wordCount')}
                            >
                                <option value={0}>none</option>
                                <option value={1}>1 word</option>
                                <option value={2}>2 words</option>
                                <option value={3}>3 words</option>
                                <option value={4}>4 words</option>
                                <option value={5}>5 words</option>
                            </Select>
                            <FormHelperText>How many words to show?</FormHelperText>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            {/*<InputLabel htmlFor="select-multiple-chip">Chip</InputLabel>*/}
                            <Select
                                multiple
                                value={wordCategories}
                                onChange={this.handleChange('wordCategories')}
                                input={<Input id="select-multiple-chip"/>}
                                renderValue={selected => selected.map(value => words.categories[value].name).join(', ')}
                                MenuProps={MenuProps}
                            >
                                {Object.entries(words.categories).map(([key, val]) => (
                                    <MenuItem
                                        key={key}
                                        value={key}
                                    >
                                        <Checkbox checked={wordCategories.indexOf(key) !== -1}/>
                                        <ListItemText
                                            primary={val.name}
                                            secondary={`${val.words.slice(0, 4).map(x => x.toLowerCase()).join(', ')}`}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Which kinds of words?</FormHelperText>
                        </FormControl>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel className={classes.panel} defaultExpanded={wasChanged.advanced}>
                    <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                        <Typography variant="title">Advanced</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.panelDetails}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="max-quality">Max quality of images</InputLabel>
                            <Select
                                value={maxQuality}
                                onChange={this.handleChange('maxQuality')}
                                inputProps={{
                                    id: 'max-quality',
                                }}
                            >
                                <MenuItem value={'z'}>Medium</MenuItem>
                                <MenuItem value={'b'}>Large</MenuItem>
                                <MenuItem value={'h'}>Very large</MenuItem>
                            </Select>
                        </FormControl>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <Toolbar/>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(SetupGeneral)
