import React from "react";
import PropTypes from "prop-types";

import { toTitleCase } from "../../utils";

const SearchResults = ({
  isOrigin,
  isFocus,
  searchValue,
  searchResults,
  handleGeolocation,
  handleSelectedResult,
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

  function renderWrapper() {
    let wrapper;

    // Origin search results
    // If on focus, show <ul> because "Use Current Location" is always present
    if (isFocus && isOrigin) {
      wrapper = (
        <ul>
          <li
            onMouseDown={handleGeolocation}
            key="58bfeeaf-5785-4966-9037-b248397608a7"
          >
            Use Current Location
          </li>
          {renderResults()}
        </ul>
      );
    }

    // Destination search results
    // If on focus, <ul> itself is not rendered unless there are results
    else if (
      isFocus &&
      !isOrigin &&
      searchResults.length > 0 &&
      searchValue.length > 2
    ) {
      wrapper = <ul>{renderResults()}</ul>;
    }

    return wrapper;
  }

  return <React.Fragment>{renderWrapper()}</React.Fragment>;
};

SearchResults.propTypes = {
  isOrigin: PropTypes.bool.isRequired,
  isFocus: PropTypes.bool.isRequired,
  searchValue: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  handleGeolocation: PropTypes.func.isRequired,
  handleSelectedResult: PropTypes.func.isRequired,
};

export default SearchResults;
