import { useReducer, useState, useEffect } from "react";
import axios from "axios";

// API data
const DEFAULT_QUERY = "react";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";
// [HackerNews/API: Documentation and Samples for the Official HN API](https://github.com/HackerNews/API)
// [HN Search API | HN Search powered by Algolia](https://hn.algolia.com/api)

function getUrlString(searchTerm, page = 0) {
  return `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
}

async function resolveThis(promise) {
  const resolved = {
    data: null,
    error: null
  };
  try {
    resolved.data = await promise;
  } catch (error) {
    resolved.error = error;
  }
  return resolved;
}

//TODO: axios bug - check it later
// check it by changing DEFAULT_QUERY to 'javascript'
// [Requests to urls containing 'javascript' are failing · Issue #2646 · axios/axios](https://github.com/axios/axios/issues/2646)
async function getStories(urlString) {
  return await resolveThis(axios(urlString));
}

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, isError: false, errorMsg: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMsg: action.payload
      };
    default:
      throw new Error("useHackerNewsApi.js - dataFetchReducer error!");
  }
};

const useHackerNewsApi = initialUrlString => {
  const [urlString, setUrlString] = useState(initialUrlString);

  const initialState = {
    isLoading: false,
    isError: false,
    errorMsg: null,
    data: { hits: [] }
  };

  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  useEffect(() => {
    //TODO: use useIsMounted hook from npm!
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      const { data: result, error } = await getStories(urlString);
      if (result) {
        didCancel || dispatch({ type: "FETCH_SUCCESS", payload: result.data }); // 2x data due to axios api
      } else {
        didCancel ||
          dispatch({ type: "FETCH_FAILURE", payload: error.toString() });
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [urlString]);
  return [state, setUrlString];
};

export default useHackerNewsApi;
export { DEFAULT_QUERY, getUrlString };
