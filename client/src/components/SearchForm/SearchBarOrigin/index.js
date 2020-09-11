import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarOrigin = () => (
  <SearchConsumer>
    {({ origin, destination, originInputValue, destInputValue, actions }) => (
      <SearchBar
        isOrigin={true}
        inputValue={originInputValue}
        address={origin}
        setInputValue={actions.setOriginInputValue}
        setAddress={actions.setOrigin}
        // ------------------------- //
        oppositeInput={destInputValue}
        oppositeAddress={destination}
        setOppositeInput={actions.setDestInputValue}
        setOppositeAddress={actions.setDestination}
        // ------------------------- //
        setNotification={actions.setNotification}
        setItineraries={actions.setItineraries}
        handleSetItineraries={actions.handleSetItineraries}
      />
    )}
  </SearchConsumer>
);

export default SearchBarOrigin;
