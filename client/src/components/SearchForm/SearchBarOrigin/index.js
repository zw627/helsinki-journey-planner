import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarOrigin = () => {
  return (
    <SearchConsumer>
      {({ origin, destination, actions }) => (
        <SearchBar
          isOrigin={true}
          setAddress={actions.setOrigin}
          origin={origin}
          destination={destination}
          handleSetItineraries={actions.handleSetItineraries}
        />
      )}
    </SearchConsumer>
  );
};

export default SearchBarOrigin;
