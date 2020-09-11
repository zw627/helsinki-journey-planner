import { useState, useEffect } from "react";
import axios from "axios";

const useSearchResults = (searchValue) => {
  const [searchResults, setSearchResults] = useState([]);

  // Fetch and set
  async function handleSearchResults(value) {
    try {
      const res = await axios.post(process.env.REACT_APP_API_ADDRESS_SEARCH, {
        text: value,
      });
      setSearchResults(res.data);
    } catch (err) {
      setSearchResults([]);
    }
  }

  // Fetch when more than two characters, otherwise unmount SearchResults
  useEffect(() => {
    if (searchValue.length > 2) {
      handleSearchResults(searchValue);
    } else {
      setSearchResults([]);
    }
  }, [searchValue]);

  return searchResults;
};

export default useSearchResults;
