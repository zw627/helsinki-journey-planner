import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarDest = () => (
  <SearchConsumer>
    {({ origin, destination, actions }) => (
      <SearchBar
        isOrigin={false}
        address={destination}
        setAddress={actions.setDestination}
        // ------------------------- //
        oppositeAddress={origin}
        setOppositeAddress={actions.setOrigin}
        // ------------------------- //
        setNotification={actions.setNotification}
        setItineraries={actions.setItineraries}
        fetchItineraries={actions.fetchItineraries}
      />
    )}
  </SearchConsumer>
);

export default SearchBarDest;
