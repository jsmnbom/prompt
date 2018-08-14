import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import SetupMotifCategory from "./SetupMotifCategory";
import lizard from './img/lizards.jpg';
import cat from './img/cats.jpg';

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

const categories = [
    {
        name: 'Lizards',
        img: lizard
    }, {
        name: 'Cats',
        img: cat
    },
];

class SetupMotifs extends Component {
    render() {
        const {classes} = this.props;

        return (
            <div className={classes.container}>
                {categories.map(({name, img}) => {
                    return (
                        <div className={classes.item}>
                            <SetupMotifCategory name={name} image={img}/>
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
