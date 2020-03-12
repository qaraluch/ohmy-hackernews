import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import SvgIcon from "@material-ui/core/SvgIcon";

const useStyles = makeStyles(theme => ({
  root: {
    height: 55,
    width: 55,
    color: theme.palette.primary.main
  }
}));

function HnIcon(props) {
  const classes = useStyles();
  return (
    <Link
      href={"https://news.ycombinator.com/"}
      target="_blank"
      rel="noopener noreferrer"
    >
      <SvgIcon {...props} className={classes.root} viewBox="0 0 48 48">
        <path fill="currentColor" d="M8,8v32h32V8H8z M38,38H10V10h28V38z" />
        <path
          fill="currentColor"
          d="M23 32L25 32 25 26 30.5 16 28.4 16 24 24.1 19.6 16 17.5 16 23 26z"
        />
      </SvgIcon>
    </Link>
  );
}

export { HnIcon };
