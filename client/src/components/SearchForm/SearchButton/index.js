import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import "./style.css";

const SearchButton = () => {
  return (
    <SearchConsumer>
      {({ actions }) => (
        <button type="submit" onClick={actions.getItineraries} onTouchStart={() => {}}>
          Search
        </button>
      )}
    </SearchConsumer>
  );
};

export default SearchButton;
