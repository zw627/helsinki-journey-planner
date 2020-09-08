import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import { getFormattedDate, getFormattedTime } from "../../../utils/index";
import "./index.css";

const SearchButton = (props) => {
  function handleOnClick(e) {
    e.preventDefault();
    props.handleSetItineraries(
      props.origin,
      props.destination,
      getFormattedDate(),
      getFormattedTime()
    );
  }

  return (
    <button type="submit" onClick={handleOnClick}>
      Search
    </button>
  );
};

const SearchButtonWrapper = () => (
  <SearchConsumer>
    {({ origin, destination, actions }) => (
      <SearchButton
        origin={origin}
        destination={destination}
        handleSetItineraries={actions.handleSetItineraries}
      />
    )}
  </SearchConsumer>
);
export default SearchButtonWrapper;
