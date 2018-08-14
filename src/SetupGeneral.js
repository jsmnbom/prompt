import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {
    Paper,
    Typography,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormControl,
    Checkbox,
    Select,
    MenuItem,
    Input,
    Chip
} from "@material-ui/core";

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
    },
    paper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 9,
        padding: theme.spacing.unit * 2,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            marginTop: theme.spacing.unit * 6,
            marginBottom: theme.spacing.unit * 12,
            padding: theme.spacing.unit * 3,
        },
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

const TEXT_CATEGORIES = [
    'Feelings', 'Time', 'Taste', 'Appearence', 'Size', 'Age', 'Shape', 'Material', 'Motion'
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
    handleChange = name => event => {
        this.props.updateData({[name]: event.target.value});
    };

    handleChangeChecked = name => event => {
        this.props.updateData({[name]: event.target.checked});
    };

    render() {
        const {classes, theme, data} = this.props;
        const {timePer, showPalette, textCategories, textCount} = data;

        return (
            <div className={classes.layout}>
                <Paper className={classes.paper}>
                    <FormControl component="fieldset">
                        <Typography variant="title" gutterBottom>
                            Time per prompt
                        </Typography>
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
                        <Typography variant="title" gutterBottom>
                            Colour palettes
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showPalette}
                                    onChange={this.handleChangeChecked('showPalette')}
                                    value="showPalette"
                                />
                            }
                            label="Show a random colour palette"
                        />
                        <Typography variant="title" gutterBottom>
                            Text
                        </Typography>
                        <div className={classes.vertical}>
                            <Typography variant="body1">
                                Choose
                            </Typography>
                            <Select
                                native
                                value={textCount}
                                onChange={this.handleChange('textCount')}
                            >
                                <option value={1}>1 word</option>
                                <option value={2}>2 words</option>
                                <option value={3}>3 words</option>
                                <option value={4}>4 words</option>
                                <option value={5}>5 words</option>
                            </Select>
                            <Typography variant="body1">
                                from word categories:
                            </Typography>
                        </div>

                        <FormControl className={classes.formControl}>
                            {/*<InputLabel htmlFor="select-multiple-chip">Chip</InputLabel>*/}
                            <Select
                                multiple
                                value={textCategories}
                                onChange={this.handleChange('textCategories')}
                                input={<Input id="select-multiple-chip"/>}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip key={value} label={value} className={classes.chip}/>
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {TEXT_CATEGORIES.map(category => (
                                    <MenuItem
                                        key={category}
                                        value={category}
                                        style={{
                                            fontWeight:
                                                textCategories.indexOf(category) === -1
                                                    ? theme.typography.fontWeightRegular
                                                    : theme.typography.fontWeightMedium,
                                        }}
                                    >
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </FormControl>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(SetupGeneral)
