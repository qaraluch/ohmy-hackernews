import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  box: {
    padding: theme.spacing(2)
  }
}));

const Error = ({ errorMsg, ...props }) => {
  const classes = useStyles();
  return (
    <Typography variant="button" component="div">
      <Box {...props} color="primary.main" className={classes.box}>
        <Box>Something went wrong!</Box>
        <Box>{errorMsg}</Box>
      </Box>
    </Typography>
  );
};

export { Error };
