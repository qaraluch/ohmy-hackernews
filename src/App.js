import React, { Component } from "react";
import "./App.css";
import Todo from "./components/Todo/Todo";
import Button from "./components/Button/Button";
import { withLoading } from "./components/Loading/Loading";
import Search from "./components/Search/Search";
import Table from "./components/Table/Table";
import { getStoriesAPI, DEFAULT_QUERY } from "./api/api";

const ButtonWithLoading = withLoading(Button);

const updateSearchTopStoriesState = (hits, page) => prevState => {
  const { results, searchKey } = prevState;
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
  const updatedHits = [...oldHits, ...hits];
  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  async fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    const storiesRaw = await getStoriesAPI(searchTerm, page);
    if (storiesRaw.error) {
      this.setState({ error: storiesRaw.error });
    } else {
      const stories = await storiesRaw.data.json();
      this.setSearchTopStories(stories);
    }
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  }

  onSearchSubmit() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;

    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
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
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
            className="button-inline"
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;
