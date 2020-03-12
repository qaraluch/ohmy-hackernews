import React, { useState } from "react";
import _ from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Table from "@material-ui/core/Table";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import LinkSharpIcon from "@material-ui/icons/LinkSharp";

const useStyles = makeStyles(theme => ({
  author: {
    fontSize: "0.8rem",
    color: theme.palette.grey[500]
  },
  date: {
    marginLeft: theme.spacing(1),
    fontSize: "0.8rem",
    color: theme.palette.grey[500]
  },
  comments: {
    color: theme.palette.grey[500]
  },
  tableCellHead: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    padding: "1.2em"
  },
  tableSortLabel: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    "& .MuiTableSortLabel-icon": {
      color: [[theme.palette.common.white], "!important"]
    },
    "& > *": {
      color: theme.palette.common.white
    },
    "&:hover > *": {
      color: theme.palette.primary.main
    }
  },
  dismiss: {
    border: [[1, "solid", theme.palette.common.white]],
    color: theme.palette.grey[400],
    "&:hover": {
      border: [[1, "solid", theme.palette.primary.main]],
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white
    }
  },
  sourceLinkButton: {
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white
    }
  }
}));

const sorts = {
  COMMENTS: list => _.sortBy(list, "num_comments").reverse(),
  POINTS: list => _.sortBy(list, "points").reverse()
};

function TableResults({ list, onDismiss }) {
  const classes = useStyles();

  const initState = {
    sortKey: "POINTS", //API call returns sorted list by it
    isSortReverse: false,
    whichSortActive: "POINTS"
  };
  const [state, setState] = useState(initState);
  const { sortKey, isSortReverse, whichSortActive } = state;

  function onSort(sortKeyFromEventHandler) {
    const theSame = sortKey === sortKeyFromEventHandler;
    const newSortReverse = theSame ? !isSortReverse : isSortReverse;
    setState({
      sortKey: sortKeyFromEventHandler,
      isSortReverse: newSortReverse,
      whichSortActive: sortKeyFromEventHandler
    });
  }

  function prepareListToRender(list, sortKey, isSortReverse) {
    const sortedList = sorts[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return reverseSortedList;
  }

  const listRender = prepareListToRender(list, sortKey, isSortReverse);

  const getSortDirection = isSortReverse => (isSortReverse ? "asc" : "desc");
  const getSortActivation = sortKeyFromEventHandler =>
    sortKeyFromEventHandler === whichSortActive;

  const TableCell_HeadSort = ({ children, sortKey, ...props }) => {
    const classes = useStyles();
    return (
      <TableCell className={classes.tableCellHead} component="th" align="right">
        <TableSortLabel
          {...props}
          className={classes.tableSortLabel}
          onClick={() => onSort(sortKey)}
          active={getSortActivation(sortKey)}
        >
          {children}
        </TableSortLabel>
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCellHead}>
              <Typography>Title</Typography>
            </TableCell>
            <TableCell_HeadSort
              sortKey="COMMENTS"
              direction={getSortDirection(isSortReverse)}
            >
              <Typography>Comments</Typography>
            </TableCell_HeadSort>
            <TableCell_HeadSort
              sortKey="POINTS"
              direction={getSortDirection(isSortReverse)}
            >
              <Typography>Points</Typography>
            </TableCell_HeadSort>
            <TableCell className={classes.tableCellHead} align="center">
              <Typography>Archive</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listRender.map(item => (
            <TableRow key={item.objectID}>
              <TableCell component="th" scope="row">
                <Grid
                  container
                  direction="row"
                  justify="flex-start"
                  alignItems="center"
                >
                  <Grid item>
                    <Link
                      href={`https://news.ycombinator.com/item?id=${item.objectID}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography>{item.title}</Typography>
                    </Link>
                  </Grid>
                  <Grid item></Grid>
                  <IconButton
                    aria-label="delete"
                    className={classes.sourceLinkButton}
                  >
                    <Link
                      color="inherit"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkSharpIcon />
                    </Link>
                  </IconButton>
                  <Box className={classes.author}>{item.author} </Box>
                  <Box className={classes.date}>@{item.created_at} </Box>
                </Grid>
              </TableCell>
              <TableCell align="right" className={classes.comments}>
                {item.num_comments}
              </TableCell>
              <TableCell align="right">{item.points}</TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => onDismiss(item.objectID)}
                  aria-label="dismiss"
                  className={classes.dismiss}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export { TableResults };
