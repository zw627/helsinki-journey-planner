import React from "react";
import PropTypes from "prop-types";

import { SearchConsumer } from "../../context/SearchContext";
import { getCurrentDate, getCurrentTime } from "../../../utils/index";
import "./index.css";

const SearchButton = ({ origin, destination, fetchItineraries }) => {
  function handleOnClick(e) {
    e.preventDefault();
    fetchItineraries(
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
  fetchItineraries: PropTypes.func.isRequired,
};

const SearchButtonWrapper = () => (
  <SearchConsumer>
    {({ origin, destination, actions }) => (
      <SearchButton
        origin={origin}
        destination={destination}
        fetchItineraries={actions.fetchItineraries}
      />
    )}
  </SearchConsumer>
);
export default SearchButtonWrapper;
