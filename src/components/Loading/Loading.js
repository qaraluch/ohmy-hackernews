import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  box: {
    padding: theme.spacing(2)
  }
}));

const Loading = props => {
  const classes = useStyles();
  return (
    <Typography variant="button" component="div">
      <Box
        {...props}
        color="primary.main"
        letterSpacing={6}
        className={classes.box}
      >
        Loading...
      </Box>
    </Typography>
  );
};

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

export default Loading;

export { withLoading };
