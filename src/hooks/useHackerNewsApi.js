import { useReducer, useState, useEffect } from "react";
import useIsMounted from "./useIsMounted";
import getTimestampMonthBefore from "../utils/getTimestampMonthBefore";
import axios from "axios";

// API data
const DEFAULT_QUERY = "javascript";
const DEFAULT_HPP = "10";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_TAGS = "tags=";
const PARAM_HPP = "hitsPerPage=";
const PARAM_NUMERIC_FILTERS = "numericFilters=created_at_i>=";
// [HackerNews/API: Documentation and Samples for the Official HN API](https://github.com/HackerNews/API)
// [HN Search API | HN Search powered by Algolia](https://hn.algolia.com/api)

function getUrlString({ searchKey, page = 0, tags = "story" }) {
  const timestamp = getTimestampMonthBefore(); // in seconds
  return `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchKey}&${PARAM_TAGS}${tags}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}&${PARAM_NUMERIC_FILTERS}${timestamp}`;
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

async function getStories(urlString) {
  return await resolveThis(axios(urlString));
}

const updateCachedRequestState = (hits, page, searchKey) => prevState => {
  const dataOldCached = prevState.requestResults;
  const oldHits =
    dataOldCached && dataOldCached[searchKey]
      ? dataOldCached[searchKey].hits
      : [];
  const updatedHits = [...oldHits, ...hits];
  return {
    ...dataOldCached,
    [searchKey]: { hits: updatedHits, page }
  };
};

const cacheRequestResult = result => {
  //TODO: refactor this like folloing fn
  const [{ hits, page }, searchKey] = result;
  // Returns Higher Order Fn
  return updateCachedRequestState(hits, page, searchKey);
};

const updateCachedState = (searchKey, updatedHits) => prevState => {
  const dataOldCached = prevState.requestResults;
  return {
    ...dataOldCached,
    [searchKey]: { ...dataOldCached[searchKey], hits: updatedHits }
  };
};

const updateCache = ({ searchKey, updatedHits }) => {
  return updateCachedState(searchKey, updatedHits);
};

const dataFetchReducer = (state, action) => {
  const { type, payload } = action;
  if (type === "FETCH_INIT") {
    return { ...state, isLoading: true, isError: false, errorMsg: null };
  } else if (type === "FETCH_SUCCESS") {
    const cachePayloadFn = cacheRequestResult(payload);
    return {
      ...state,
      isLoading: false,
      isError: false,
      requestQuery: payload[2], // see: -->[1]
      requestResults: cachePayloadFn(state)
    };
  } else if (type === "FETCH_FAILURE") {
    return {
      ...state,
      isLoading: false,
      isError: true,
      errorMsg: payload
    };
  } else if (type === "UPDATE_CACHE") {
    const updateCachePayloadFn = updateCache(payload);
    return {
      ...state,
      isLoading: false,
      isError: false,
      requestResults: updateCachePayloadFn(state)
    };
  } else {
    throw new Error("useHackerNewsApi.js - dataFetchReducer error!");
  }
};

const useHackerNewsApi = initialApiQuery => {
  const isMounted = useIsMounted();
  const [apiQuery, setApiQuery] = useState(initialApiQuery);
  const [updateCacheData, setUpdateCacheData] = useState({});
  const { searchKey } = apiQuery;

  const initialState = {
    isLoading: false,
    isError: false,
    errorMsg: null,
    requestQuery: null,
    requestResults: {}
  };

  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      const urlRequest = getUrlString(apiQuery);
      console.log("Request url: ", urlRequest);
      const { data: result, error } = await getStories(urlRequest);
      if (result) {
        isMounted.current &&
          dispatch({
            type: "FETCH_SUCCESS",
            payload: [result.data, searchKey, urlRequest] // see: -->[1]
          }); // 2x data due to axios api
      } else {
        isMounted.current &&
          dispatch({ type: "FETCH_FAILURE", payload: error.toString() });
      }
    };
    fetchData();
  }, [apiQuery]);

  useEffect(() => {
    isMounted.current &&
      dispatch({
        type: "UPDATE_CACHE",
        payload: updateCacheData
      });
  }, [updateCacheData]);

  return [state, setApiQuery, setUpdateCacheData];
  //setApiQuery === doFetch
  //setUpdateCacheData === updateCache
};

export default useHackerNewsApi;
export { DEFAULT_QUERY };
