import React from "react";
import PropTypes from "prop-types";

import { toTitleCase } from "../../utils";

const SearchResults = ({
  isOrigin,
  searchValue,
  searchResults,
  handleSelectedResult,
  handleGeolocation,
}) => {
  function renderResults() {
    // Render results if available
    // and search value has more than 2 characters
    if (searchResults.length > 0 && searchValue.length > 2)
      return searchResults.map((result) => {
        const id = result["id"];
        const namePriamry = result["labelPriamry"];
        const nameSecondary = result["labelSecondary"];
        const layer = toTitleCase(result["layer"]);

        return (
          <li onMouseDown={() => handleSelectedResult(result)} key={id}>
            {namePriamry}
            <span>
              {nameSecondary} ({layer})
            </span>
          </li>
        );
      });
  }

  return (
    <ul>
      <li
        onMouseDown={handleGeolocation}
        key={
          isOrigin
            ? "58bfeeaf-5785-4966-9037-b248397608a7-origin"
            : "58bfeeaf-5785-4966-9037-b248397608a7-destination"
        }
      >
        Use Current Location
      </li>
      {renderResults()}
    </ul>
  );
};

SearchResults.propTypes = {
  isOrigin: PropTypes.bool.isRequired,
  searchValue: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleSelectedResult: PropTypes.func.isRequired,
  handleGeolocation: PropTypes.func.isRequired,
};

export default SearchResults;
