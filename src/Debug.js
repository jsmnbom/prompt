import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import categories, {categoryFromName} from './data/motifs'
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import remove from "lodash/remove";

const styles = theme => ({
    root: {
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,

    },
    paper: {
        width: 'auto',
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        paddingTop: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column'
    },
    select: {
        flexGrow: 1
    },
    imgContainer: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    thumb: {
        width: '100%',
        [theme.breakpoints.up(600 + theme.spacing.unit * 2 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto'
        },
        display: 'block'
    },
    img: {
        maxWidth: '50%',
        [theme.breakpoints.up('sm')]: {
            maxWidth: '25%'
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: '14%'
        },
        display: 'block',
        objectFit: 'contain'
    }
});

class Debug extends Component {
    state = {
        selectedCategory: '',
        anchorEl: null,
        jsonData: ''
    };

    handleChange = (event) => {
        const cat = event.target.value === '' ? '' : categoryFromName(event.target.value);
        this.setState({
            selectedCategory: cat,
            jsonData: cat === '' ? '' : JSON.stringify(cat)
        });
    };

    handleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    handleClose = (event) => {
        this.setState({
            anchorEl: null
        });
    };

    handleRemoveClick = (event) => {
        const id = this.state.anchorEl.dataset.id;
        this.setState((prevState) => {
            remove(prevState.selectedCategory.images, (img) => img.id === id);

            return {
                selectedCategory: {
                    ...prevState.selectedCategory,
                },
                jsonData: JSON.stringify(prevState.selectedCategory),
                anchorEl: null
            }
        });
    };

    handleUseAsThumbClick = (event) => {
        const id = this.state.anchorEl.dataset.id;
        this.setState((prevState) => {
            if (prevState.selectedCategory.thumb !== null) prevState.selectedCategory.images.push(prevState.selectedCategory.thumb);
            prevState.selectedCategory.thumb = remove(prevState.selectedCategory.images, (img) => img.id === id)[0];

            return {
                selectedCategory: {
                    ...prevState.selectedCategory,
                },
                jsonData: JSON.stringify(prevState.selectedCategory),
                anchorEl: null
            }
        });
    };


    render() {
        const {classes} = this.props;
        const {selectedCategory, anchorEl, jsonData} = this.state;

        const cat = selectedCategory;

        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <FormControl>
                        <InputLabel shrink htmlFor="category">
                            Category
                        </InputLabel>
                        <Select
                            id="category"
                            className={classes.select}
                            value={cat === '' ? '' : cat.name}
                            onChange={this.handleChange}
                            autoWidth
                            displayEmpty
                        >
                            <MenuItem value="">
                                None
                            </MenuItem>
                            {categories.map(({name}) => {
                                return (
                                    <MenuItem key={name} value={name}>{name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>

                    <TextField
                        label="JSON data"
                        margin="normal"
                        InputProps={{
                            readOnly: true,
                        }}
                        multiline
                        rows="4"
                        value={jsonData}
                    />
                </Paper>
                {cat && (
                    <Fragment>
                        {cat.thumb && (
                            <img src={cat.thumb.urlBase + cat.thumb.url_z}
                                 className={classes.thumb}
                                 alt={`${cat.thumb.title} by ${cat.thumb.ownername} on Flickr.com (${cat.thumb.id})`}
                                 title={`${cat.thumb.title} by ${cat.thumb.ownername} on Flickr.com (${cat.thumb.id}`}/>
                        )}
                        <div className={classes.imgContainer}>
                            {cat.images.map(img => {
                                return (
                                    <img key={img.id}
                                         src={img.urlBase + img.url_m}
                                         data-id={img.id}
                                         className={classes.img}
                                         alt={`${img.title} by ${img.ownername} on Flickr.com (${img.id})`}
                                         title={`${img.title} by ${img.ownername} on Flickr.com (${img.id}`}
                                         onClick={this.handleClick}/>
                                )
                            })}

                        </div>
                    </Fragment>
                )}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleRemoveClick}>Remove</MenuItem>
                    <MenuItem onClick={this.handleUseAsThumbClick}>Use as thumb</MenuItem>
                </Menu>
            </div>
        )
    }
}

export default withStyles(styles)(Debug)
