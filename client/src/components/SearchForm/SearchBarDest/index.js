import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarDest = () => (
  <SearchConsumer>
    {({ origin, destination, actions }) => (
      <SearchBar
        isOrigin={false}
        address={destination}
        oppositeAddress={origin}
        setAddress={actions.setDestination}
        setOppositeAddress={actions.setOrigin}
        setNotification={actions.setNotification}
        setItineraries={actions.setItineraries}
      />
    )}
  </SearchConsumer>
);

export default SearchBarDest;
