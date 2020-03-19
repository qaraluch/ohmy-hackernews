import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
  presetButton: {
    margin: theme.spacing(1)
  },
  presetsLabelBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    height: 40,
    width: 100,
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  presetsLabel: {
    marginTop: 0,
    marginRight: "auto",
    marginBottom: "auto",
    marginLeft: "auto"
  }
}));

//TODO: move presetsList to some kind of config
const presetsList = ["node.js", "React", "next.js"];

function PresetsContainer({ onClick }) {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      spacing={3}
      alignItems="center"
    >
      <Grid item className={classes.presetsLabelBox}>
        <Box elevation={0} className={classes.presetsLabel}>
          Presets:
        </Box>
      </Grid>
      {presetsList.map((item, idx) => (
        <Grid item key={idx}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.presetButton}
            disableElevation
            onClick={event => onClick(event, item)}
          >
            {item}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

export { PresetsContainer };
