import React, { useState } from "react";
import Button from "../Button/Button";
import Sort from "../Sort/Sort";
import _ from "lodash";

const SORTS = {
  NONE: list => list,
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

function Table({ list, onDismiss }) {
  const initState = {
    sortKey: "NONE",
    isSortReverse: false
  };
  const [state, setState] = useState(initState);
  const { sortKey, isSortReverse } = state;

  function onSort(sortKeyFromEventHandler) {
    const theSame = sortKey === sortKeyFromEventHandler;
    const newSortReverse = theSame ? !isSortReverse : isSortReverse;
    setState({
      sortKey: sortKeyFromEventHandler,
      isSortReverse: newSortReverse
    });
  }

  function prepareListToRender(list, sortKey, isSortReverse) {
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return reverseSortedList;
  }

  const listRender = prepareListToRender(list, sortKey, isSortReverse);

  return (
    <div className="table">
      <div className="table-header">
        <span style={largeColumn}>Title</span>
        <span style={midColumn}>Author</span>
        <span style={smallColumn}>
          <Sort activeSortKey={sortKey} sortKey={"COMMENTS"} onSort={onSort}>
            Comments
          </Sort>
        </span>
        <span style={smallColumn}>
          <Sort activeSortKey={sortKey} sortKey={"POINTS"} onSort={onSort}>
            Points
          </Sort>
        </span>
        <span style={smallColumn}>Archive</span>
      </div>
      {listRender.map(item => (
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a
              href={`https://news.ycombinator.com/item?id=${item.objectID}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.title}
            </a>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              &nbsp;&nbsp;[&gt;&gt;]
            </a>
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

export default Table;
