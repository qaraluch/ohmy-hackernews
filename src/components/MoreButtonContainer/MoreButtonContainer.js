import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AddBoxSharpIcon from "@material-ui/icons/AddBoxSharp";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
  moreButton: {
    margin: theme.spacing(5),
    color: theme.palette.common.white,
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      boxShadow: "none"
    }
  }
}));

function MoreButtonContainer(props) {
  const classes = useStyles();
  return (
    <Button
      size="large"
      variant="contained"
      className={classes.moreButton}
      startIcon={<AddBoxSharpIcon />}
      {...props}
    >
      More
    </Button>
  );
}

export { MoreButtonContainer };
