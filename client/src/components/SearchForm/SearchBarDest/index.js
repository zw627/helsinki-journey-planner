import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarDest = () => (
  <SearchConsumer>
    {({ origin, destination, originInputValue, destInputValue, actions }) => (
      <SearchBar
        isOrigin={false}
        inputValue={destInputValue}
        address={destination}
        setInputValue={actions.setDestInputValue}
        setAddress={actions.setDestination}
        // ------------------------- //
        oppositeInput={originInputValue}
        oppositeAddress={origin}
        setOppositeInput={actions.setOriginInputValue}
        setOppositeAddress={actions.setOrigin}
        // ------------------------- //
        setNotification={actions.setNotification}
        setItineraries={actions.setItineraries}
        handleSetItineraries={actions.handleSetItineraries}
      />
    )}
  </SearchConsumer>
);

export default SearchBarDest;
