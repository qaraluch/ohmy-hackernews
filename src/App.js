import React, { useState, Fragment } from "react";
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
  //TODO: analize if i can get rid of it
  const [searchKey, setSearchKey] = useState(DEFAULT_QUERY);

  const apiQueryDefault = { searchKey };
  const [
    { requestResults, isLoading, isError, errorMsg },
    doFetch
  ] = useHackerNewsApi(apiQueryDefault);

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

  const ButtonWithLoading = withLoading(Button);

  const pageForRender =
    (requestResults &&
      requestResults[searchKey] &&
      requestResults[searchKey].page) ||
    0;
  const listForRender =
    (requestResults &&
      requestResults[searchKey] &&
      requestResults[searchKey].hits) ||
    [];

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
          <Table list={listForRender} onDismiss={() => {}} />
        )}

        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => {
              // onClick={() => this.fetchSearchTopStories(searchKey, pageForRender + 1)}
              // setSearchKey(searchKey);
              // setPage(page + 1);
            }}
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
