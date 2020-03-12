import React, { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1)
    }
  }
}));

function SearchContainer({ value, onChange, onSubmit }) {
  const classes = useStyles();
  return (
    <form
      className={classes.form}
      onSubmit={onSubmit}
      noValidate
      autoComplete="off"
    >
      <label htmlFor="search">
        <Grid
          container
          direction="row"
          justify="flex-start"
          spacing={3}
          alignItems="center"
        >
          <Grid item>
            <TextField
              size="small"
              label="Search"
              variant="outlined"
              id="search"
              type="text"
              value={value}
              onChange={onChange}
              autoFocus={true}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disableElevation
            >
              <SearchIcon />
            </Button>
          </Grid>
        </Grid>
      </label>
    </form>
  );
}

export { SearchContainer };
