import resolveThis from "../utils/resolveThis";

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

async function getStoriesAPI(searchTerm, page) {
  const requestString = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
  return await resolveThis(fetch(requestString));
}

export { getStoriesAPI, DEFAULT_QUERY };
