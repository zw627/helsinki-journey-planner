import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarOrigin = () => (
  <SearchConsumer>
    {({ origin, destination, actions }) => (
      <SearchBar
        isOrigin={true}
        address={origin}
        setAddress={actions.setOrigin}
        // ------------------------- //
        oppositeAddress={destination}
        setOppositeAddress={actions.setDestination}
        // ------------------------- //
        setNotification={actions.setNotification}
        setItineraries={actions.setItineraries}
        fetchItineraries={actions.fetchItineraries}
      />
    )}
  </SearchConsumer>
);

export default SearchBarOrigin;
