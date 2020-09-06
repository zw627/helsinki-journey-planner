import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import "./style.css";

const SearchButton = () => {
  return (
    <SearchConsumer>
      {({ actions }) => (
        <button type="submit" onClick={actions.getItineraries}>
          Search
        </button>
      )}
    </SearchConsumer>
  );
};

export default SearchButton;
