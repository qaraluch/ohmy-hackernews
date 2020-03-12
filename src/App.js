import React, { useEffect, useState } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { theme } from "./theme/theme";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

import { HnIcon } from "./components/HnIcon/HnIcon";
import { GhCorner } from "./components/GhCorner/GhCorner";
import { SearchContainer } from "./components/SearchContainer/SearchContainer";
import { PresetsContainer } from "./components/PresetsContainer/PresetsContainer";
import { MoreButtonContainer } from "./components/MoreButtonContainer/MoreButtonContainer";
import { Error } from "./components/Error/Error";

import { withLoading } from "./components/Loading/Loading";
import { TableResults } from "./components/TableResults/TableResults";
import useHackerNewsApi, { DEFAULT_QUERY } from "./hooks/useHackerNewsApi";

const useStyles = makeStyles(theme => ({
  searchRoot: {
    padding: theme.spacing(3)
  },
  tableRoot: {
    padding: theme.spacing(3)
  }
}));

function App() {
  const classes = useStyles();
  // query is fluctuant state that changes with every key stroke in the input field
  const [query, setQuery] = useState(DEFAULT_QUERY);
  // searchKey is used for api request and cache system
  const [searchKey, setSearchKey] = useState(DEFAULT_QUERY);
  const [listToRender, setListToRender] = useState([]);

  const apiQueryDefault = { searchKey };
  const [
    { requestResults, isLoading, isError, errorMsg },
    doFetch,
    updateCache
  ] = useHackerNewsApi(apiQueryDefault);

  const getListForRender = (requestResults, searchKey) => {
    const list =
      (requestResults &&
        requestResults[searchKey] &&
        requestResults[searchKey].hits) ||
      [];
    return list;
  };

  const getPageForRender = (requestResults, searchKey) => {
    const page =
      (requestResults &&
        requestResults[searchKey] &&
        requestResults[searchKey].page) ||
      0;
    return page;
  };

  useEffect(() => {
    setListToRender(getListForRender(requestResults, searchKey));
  }, [requestResults, searchKey]);

  const onSearchChange = event => setQuery(event.target.value);

  const checkIfReguestAlreadyCached = searchKey => !requestResults[searchKey];

  const onSearchSubmit = (event, presetQuery) => {
    // hooks gotcha - stale state in the eventhandler; see tiljs: react-hooks.md
    let queryLocal;
    if (presetQuery) {
      // submit from preset
      queryLocal = presetQuery;
      setQuery(queryLocal);
    } else {
      // submit from search
      queryLocal = query; // query from state
    }
    setSearchKey(queryLocal);
    if (checkIfReguestAlreadyCached(queryLocal)) {
      const newApiQuery = { searchKey: queryLocal };
      doFetch(newApiQuery);
    }
    event.preventDefault();
  };

  const onTablesRowDismiss = id => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = listToRender.filter(isNotId);
    updateCache({ searchKey, updatedHits });
  };

  const MoreButtonContainerWithLoading = withLoading(MoreButtonContainer);

  const nextPage = getPageForRender(requestResults, searchKey) + 1;

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="xl">
          <GhCorner
            href="https://github.com/qaraluch/ohmy-hackernews"
            bgColor="black"
            size={80}
          />
          <Grid
            container
            direction="row"
            justify="space-between"
            spacing={3}
            alignItems="flex-start"
            className={classes.searchRoot}
          >
            <Grid item xs={1}>
              <HnIcon />
            </Grid>
            <Grid item xs={4}>
              <SearchContainer
                value={query}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
              />
            </Grid>
            <Grid item xs={7}>
              <PresetsContainer onClick={onSearchSubmit} />
            </Grid>
          </Grid>
        </Container>
        <Container maxWidth="xl">
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            className={classes.tableRoot}
          >
            <Grid item>
              {isError ? (
                <Error errorMsg={errorMsg} />
              ) : (
                <TableResults
                  list={listToRender}
                  onDismiss={onTablesRowDismiss}
                />
              )}
            </Grid>
            <Grid item>
              <MoreButtonContainerWithLoading
                isLoading={isLoading}
                onClick={() => doFetch({ searchKey, page: nextPage })}
              />
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
