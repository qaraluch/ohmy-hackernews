import React, { useEffect, useState, Fragment } from "react";
import "./App.css";
import Button from "./components/Button/Button";
import { withLoading } from "./components/Loading/Loading";
import Search from "./components/Search/Search";
import Table from "./components/Table/Table";
import useHackerNewsApi, { DEFAULT_QUERY } from "./hooks/useHackerNewsApi";

function App() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [searchKey, setSearchKey] = useState(DEFAULT_QUERY);
  const [listToRender, setListToRender] = useState([]);

  const apiQueryDefault = { searchKey };
  const [
    { requestResults, isLoading, isError, errorMsg },
    doFetch
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

  const onSearchSubmit = event => {
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

  const nextPage = getPageForRender(requestResults, searchKey) + 1;

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
