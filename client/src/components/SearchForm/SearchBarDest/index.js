import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarDest = () => {
  return (
    <SearchConsumer>
      {({ actions }) => (
        <SearchBar isOrigin={false} setAddress={actions.setDestination} />
      )}
    </SearchConsumer>
  );
};

export default SearchBarDest;
