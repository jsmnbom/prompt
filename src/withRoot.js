import React from "react";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {purple, green} from '@material-ui/core/colors'
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: purple[300],
            main: purple[500],
            dark: purple[700],
        },
        secondary: {
            light: green[300],
            main: green[500],
            dark: green[700],
        },
    },
});

function withRoot(Component) {
    function WithRoot(props) {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <Component {...props} />
            </MuiThemeProvider>
        );
    }

    return WithRoot;
}

export default withRoot;