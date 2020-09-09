import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarOrigin = () => {
  return (
    <SearchConsumer>
      {({ origin, destination, actions }) => (
        <SearchBar
          isOrigin={true}
          address={origin}
          oppositeAddress={destination}
          setAddress={actions.setOrigin}
          setOppositeAddress={actions.setDestination}
          setNotification={actions.setNotification}
          setItineraries={actions.setItineraries}
        />
      )}
    </SearchConsumer>
  );
};

export default SearchBarOrigin;
