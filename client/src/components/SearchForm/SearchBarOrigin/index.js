import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import SearchBar from "../../shared/SearchBar";

const SearchBarOrigin = () => {
  return (
    <SearchConsumer>
      {({ origin, destination, notification, actions }) => (
        <SearchBar
          isOrigin={true}
          setAddress={actions.setOrigin}
          origin={origin}
          destination={destination}
          notification={notification}
          setNotification={actions.setNotification}
          setItineraries={actions.setItineraries}
          handleSetItineraries={actions.handleSetItineraries}
        />
      )}
    </SearchConsumer>
  );
};

export default SearchBarOrigin;
