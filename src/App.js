import React, { useState, useEffect } from "react";
import "./App.css";
import Todo from "./components/Todo/Todo";
import Button from "./components/Button/Button";
import { withLoading } from "./components/Loading/Loading";
import Search from "./components/Search/Search";
import Table from "./components/Table/Table";
import { getStoriesAPI, DEFAULT_QUERY } from "./api/api";

function App() {
  const [results, setResults] = useState(null);
  const [searchKey, setSearchKey] = useState("");
  const [searchTerm, setSearchTerm] = useState(DEFAULT_QUERY);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ButtonWithLoading = withLoading(Button);

  const updateSearchTopStoriesState = (hits, page) => {
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    setResults({
      ...results,
      [searchKey]: { hits: updatedHits, page }
    });
    setIsLoading(false);
  };

  async function fetchSearchTopStories(searchTerm, page = 0) {
    setIsLoading(true);
    const storiesRaw = await getStoriesAPI(searchTerm, page);
    if (storiesRaw.error) {
      setError(storiesRaw.error);
    } else {
      const stories = await storiesRaw.data.json();
      setSearchTopStories(stories);
    }
  }

  useEffect(() => {
    setSearchKey(searchTerm);
    fetchSearchTopStories(searchTerm);
  }, [searchTerm]); // w klasie jest searchTerm a działa w searchKey. dlaczego?

  const needsToSearchTopStories = searchTerm => !results(searchTerm);

  const onDismiss = id => {
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    setResults({ ...results, [searchKey]: { hits: updatedHits, page } });
  };

  const onSearchSubmit = () => {
    if (needsToSearchTopStories(searchTerm)) {
      fetchSearchTopStories(searchTerm);
    }
    //preventDefault() event method to suppress the native browser behavior
    //do not want the browser to reload when you hit submit on search field
    //React handle it instead.
    event.preventDefault();
  };

  const setSearchTopStories = result => {
    const { hits, page } = result;
    updateSearchTopStoriesState(hits, page);
  };

  const onSearchChange = event => setSearchTerm(event.target.value);

  const page = (results && results[searchKey] && results[searchKey].page) || 0;
  const list = (results && results[searchKey] && results[searchKey].hits) || [];

  return (
    <div className="page">

      <div className="interactions">
        <Search
          value={searchTerm}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
        >
          HackerNews Search
        </Search>
      </div>

      <Todo />

      {error ? (
        <div className="interactions">
          <p>Something went wrong!</p>
          <p>{error.toString()}</p>
        </div>
      ) : (
        <Table list={list} onDismiss={onDismiss} />
      )}

      <div className="interactions">
        <ButtonWithLoading
          isLoading={isLoading}
          onClick={() => fetchSearchTopStories(searchKey, page + 1)}
          className="button-inline"
        >
          More
        </ButtonWithLoading>
      </div>
    </div>
  );
}

export default App;
