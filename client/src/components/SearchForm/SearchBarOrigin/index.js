import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarSearcaigin = () => {
  return (
    <SearchConsumer>
      {({ actions }) => (
        <SearchBar isOrigin={true} setAddress={actions.setOrigin} />
      )}
    </SearchConsumer>
  );
};

export default SearchBarSearcaigin;
