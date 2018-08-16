import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import SetupMotifCategory from "./SetupMotifCategory";
import categories from './motifs'

const styles = theme => ({
    container: {
        display: 'flex',
        boxSizing: 'border-box',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',

        paddingTop: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 4,
        paddingRight: theme.spacing.unit * 4,
        paddingBottom: theme.spacing.unit * 10
    },
    item: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        flexGrow: 1,
        [theme.breakpoints.up('xs')]: {
            width: '90%'
        },
        [theme.breakpoints.up('sm')]: {
            width: '40%'
        },
        [theme.breakpoints.up('md')]: {
            width: '25%'
        },
        [theme.breakpoints.up('lg')]: {
            width: '20%'
        },
        marginBottom: theme.spacing.unit * 2
    },
    fakeItem: {
        height: 0
    }
});

class SetupMotifs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: props.data.motifCategories
        };
        this.updateData(this.state.categories);
    }

    updateData = (motifCategories) => {
        this.props.updateData({
            motifCategories: motifCategories
        }, motifCategories.length > 0, "Please choose at least one motif category.");
    };

    toggle = name => () => {
        this.setState((prevState) => {
            const index = prevState.categories.indexOf(name);

            if (index === -1) {
                prevState.categories.push(name);
            } else {
                prevState.categories.splice(index, 1);
            }

            this.updateData(prevState.categories);

            return {
                categories: prevState.categories
            }
        })
    };

    render() {
        const {classes, data} = this.props;
        const {motifCategories} = data;

        return (
            <div className={classes.container}>
                {categories.map(({name, images, thumb}) => {
                    return (
                        <div className={classes.item} key={name}>
                            <SetupMotifCategory
                                name={name}
                                image={images[thumb].url_z}
                                toggle={this.toggle(name)}
                                checked={motifCategories.indexOf(name) !== -1}/>
                        </div>
                    )
                })}
                {/*To style last row properly*/}
                <div className={`${classes.item} ${classes.fakeItem}`}/>
                <div className={`${classes.item} ${classes.fakeItem}`}/>
                <div className={`${classes.item} ${classes.fakeItem}`}/>
            </div>
        )
    }
}

export default withStyles(styles)(SetupMotifs)