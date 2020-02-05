import React, { useEffect, useState, Fragment } from "react";
import "./App.css";
import Todo from "./components/Todo/Todo";
import Button from "./components/Button/Button";
import { withLoading } from "./components/Loading/Loading";
import Search from "./components/Search/Search";
import Table from "./components/Table/Table";
import useHackerNewsApi, { DEFAULT_QUERY } from "./hooks/useHackerNewsApi";

function App() {
  // query is fluctuant state that changes with every key stroke in the input field
  const [query, setQuery] = useState(DEFAULT_QUERY);
  // searchKey is used for api request and cache system
  const [searchKey, setSearchKey] = useState(DEFAULT_QUERY);
  const [listToRender, setListToRender] = useState([]);

  const apiQueryDefault = { searchKey };
  const [
    { requestResults, isLoading, isError, errorMsg },
    doFetch
  ] = useHackerNewsApi(apiQueryDefault);

  const getListForRender = requestResults => {
    const list =
      (requestResults &&
        requestResults[searchKey] &&
        requestResults[searchKey].hits) ||
      [];
    return list;
  };

  const getPageForRender = requestResults => {
    const page =
      (requestResults &&
        requestResults[searchKey] &&
        requestResults[searchKey].page) ||
      0;
    return page;
  };

  useEffect(() => {
    setListToRender(getListForRender(requestResults));
  }, [requestResults]);

  const onSearchChange = event => setQuery(event.target.value);

  const checkIfReguestAlreadyCached = searchKey => !requestResults[searchKey];

  const onSearchSubmit = event => {
    // hooks gotcha - stale state in the eventhandler; see tiljs: react-hooks.md
    setSearchKey(query);
    if (checkIfReguestAlreadyCached(query)) {
      const newApiQuery = { searchKey: query };
      doFetch(newApiQuery);
    }
    event.preventDefault();
  };

  const onTablesRowDismiss = id => {
    const isNotId = item => item.objectID !== id;
    const updatedHits = listToRender.filter(isNotId);
    setListToRender(updatedHits);
  };

  const ButtonWithLoading = withLoading(Button);

  const nextPage = getPageForRender(requestResults) + 1;

  return (
    <Fragment>
      <div className="page">
        <div className="interactions">
          <Search
            value={query}
            onChange={onSearchChange}
            onSubmit={onSearchSubmit}
          >
            HackerNews Search
          </Search>
        </div>

        <Todo />

        {isError ? (
          <div className="interactions">
            <p>Something went wrong!</p>
            <p>{errorMsg}</p>
          </div>
        ) : (
          <Table list={listToRender} onDismiss={onTablesRowDismiss} />
        )}

        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => doFetch({ searchKey, page: nextPage })}
            className="button-inline"
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
