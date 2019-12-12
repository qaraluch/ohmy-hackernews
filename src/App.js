import React, { Component } from "react";
import classNames from "classnames";
import _ from "lodash";
import "./App.css";

//API data
const DEFAULT_QUERY = "javascript";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";
// [HackerNews/API: Documentation and Samples for the Official HN API](https://github.com/HackerNews/API)
// [HN Search API | HN Search powered by Algolia](https://hn.algolia.com/api)

// Sorts
const SORTS = {
  NONE: list => list,
  TITLE: list => _.sortBy(list, "title"),
  AUTHOR: list => _.sortBy(list, "author"),
  COMMENTS: list => _.sortBy(list, "num_comments").reverse(),
  POINTS: list => _.sortBy(list, "points").reverse()
};

const largeColumn = {
  width: "40%"
};

const midColumn = {
  width: "30%"
};

const smallColumn = {
  width: "10%"
};

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

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({ error }));
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

function Button({ onClick, className = "", children }) {
  return (
    <button onClick={onClick} className={className} type="button">
      {children}
    </button>
  );
}

const Loading = () => <div>Loading...</div>;

const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);

class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={el => (this.input = el)}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }
}

const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const sortClass = classNames("button-inline", {
    "button-active": sortKey === activeSortKey
  });
  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button>
  );
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: "NONE",
      isSortReverse: false
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: "40%" }}>
            <Sort
              activeSortKey={sortKey}
              sortKey={"TITLE"}
              onSort={this.onSort}
            >
              Title
            </Sort>
          </span>
          <span style={{ width: "30%" }}>
            <Sort
              activeSortKey={sortKey}
              sortKey={"AUTHOR"}
              onSort={this.onSort}
            >
              Author
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort
              activeSortKey={sortKey}
              sortKey={"COMMENTS"}
              onSort={this.onSort}
            >
              Comments
            </Sort>
          </span>
          <span style={{ width: "10%" }}>
            <Sort
              activeSortKey={sortKey}
              sortKey={"POINTS"}
              onSort={this.onSort}
            >
              Points
            </Sort>
          </span>
          <span style={{ width: "10%" }}>Archive</span>
        </div>
        {reverseSortedList.map(item => (
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}

const Todo = () => (
  <div>
    TODO:
    <ul>
      <li>- add clicable logo</li>
      <li>- dodaj filtrowanie na client-side</li>
      <li>- add query string</li>
      <li>
        - use awsomefonts arrows for sort - [React | Font
        Awesome](https://fontawesome.com/how-to-use/on-the-web/using-with/react)
      </li>
      <li>
        - add dateRange and popularity -
        ?dateRange=pastMonth&page=0&prefix=false&query=javascript&sort=byPopularity&type=story
      </li>
    </ul>
  </div>
);

//TODO:
// <HNIcon />
// function HNIcon() {
//   return (
//     <div>
//       <img src="page/hackernews-icon.svg" alt="" />
//     </div>
//   );
// }
// import { ReactComponent as HNIcon } from "../page/hackernews-icon.svg";
// [tanem/react-svg: A React component that injects SVG into the DOM.](https://github.com/tanem/react-svg)
// svg part [CSS { In Real Life } | A Modern Front End Workflow Part 2: Module Bundling with Parcel](https://css-irl.info/a-modern-front-end-workflow-part-2/)

export default App;

// Export for testing.
export { Button, Table, Search };
