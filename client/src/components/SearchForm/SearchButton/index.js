import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import { getFormattedDate, getFormattedTime } from "../../../utils/index";
import "./index.css";

const SearchButton = () => {
  return (
    <SearchConsumer>
      {({ origin, destination, actions }) => {
        const handleOnClick = (e) => {
          e.preventDefault();
          actions.handleSetItineraries(
            origin,
            destination,
            getFormattedDate(),
            getFormattedTime()
          );
        };

        return (
          <button type="submit" onClick={handleOnClick}>
            Search
          </button>
        );
      }}
    </SearchConsumer>
  );
};

export default SearchButton;
