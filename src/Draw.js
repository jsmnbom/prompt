import React, {Component, Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";
import {compose} from "recompose";
import {parse} from "qs";

const styles = theme => ({});

class Draw extends Component {
    render() {
        console.log(this.props);
        const {classes} = this.props;
        console.log(parse(this.props.location.search, {ignoreQueryPrefix: true}));

        return (
            <Fragment>

            </Fragment>
        )
    }
}

export default compose(
    withStyles(styles),
    withRouter,
)(Draw);
