import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarDest = () => {
  return (
    <SearchConsumer>
      {({ origin, destination, actions }) => (
        <SearchBar
          isOrigin={false}
          setAddress={actions.setDestination}
          origin={origin}
          destination={destination}
          handleSetItineraries={actions.handleSetItineraries}
        />
      )}
    </SearchConsumer>
  );
};

export default SearchBarDest;
