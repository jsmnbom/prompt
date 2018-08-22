import withStyles from '@material-ui/core/styles/withStyles';
import React, {Component} from 'react';
import categories from './data/motifs'
import SetupMotifCategory from "./SetupMotifCategory";

const styles = theme => ({
    root: {
        paddingTop: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 3,
        paddingRight: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit * 10
    },
    gridList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        [theme.breakpoints.up('sm')]: {
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        },
        [theme.breakpoints.up('md')]: {
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        },
        [theme.breakpoints.up(1150)]: {
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        },
        gridGap: `${theme.spacing.unit}px`,
        gap: `${theme.spacing.unit}px`
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
            <div className={classes.root}>
                <div className={classes.gridList}>
                {categories.map(({name, images, thumb}) => {
                    return (
                            <SetupMotifCategory
                                key={name}
                                name={name}
                                image={thumb.urlBase + thumb.url_z}
                                toggle={this.toggle(name)}
                                checked={motifCategories.indexOf(name) !== -1}/>
                    )
                })}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(SetupMotifs)
