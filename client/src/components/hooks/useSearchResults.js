import { useState, useEffect } from "react";
import Axios from "axios";

const useSearchResults = (searchValue) => {
  const [searchResults, setSearchResults] = useState([]);

  async function fetchSearchResults(value) {
    try {
      const res = await Axios.post(process.env.REACT_APP_API_ADDRESS_SEARCH, {
        text: value,
      });
      setSearchResults(res.data);
    } catch (err) {
      setSearchResults([]);
    }
  }

  useEffect(() => {
    // Fetch when more than two characters
    // Else empty results to unmount SearchResults component
    if (searchValue.length > 2) {
      fetchSearchResults(searchValue);
    } else {
      setSearchResults([]);
    }
  }, [searchValue]);

  return searchResults;
};

export default useSearchResults;
