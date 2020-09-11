import React from "react";
import PropTypes from "prop-types";

import { SearchConsumer } from "../../context/SearchContext";
import { getCurrentDate, getCurrentTime } from "../../../utils/index";
import "./index.css";

const SearchButton = ({ origin, destination, handleSetItineraries }) => {
  function handleOnClick(e) {
    e.preventDefault();
    handleSetItineraries(
      origin,
      destination,
      getCurrentDate(),
      getCurrentTime()
    );
  }

  return (
    <button type="submit" onClick={handleOnClick}>
      Search
    </button>
  );
};

SearchButton.propTypes = {
  origin: PropTypes.object.isRequired,
  destination: PropTypes.object.isRequired,
  handleSetItineraries: PropTypes.func.isRequired,
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
