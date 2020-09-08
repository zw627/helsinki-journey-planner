import React from "react";

const SearchResults = ({
  isOrigin,
  value,
  focus,
  results,
  handleSelect,
  handleGeolocation,
}) => {
  let searchResultsUlElement;

  function renderResultsLiElement(results) {
    // Show results if results are valid and input has more than 2 characters
    if (results.length > 0 && value.length > 1) {
      return results.map((address) => (
        <li onMouseDown={() => handleSelect(address)} key={address["id"]}>
          {address["labelPriamry"]}
          <span>{address["labelSecondary"]}</span>
        </li>
      ));
    }
    return null;
  }

  // Origin search results
  // If on focus, show <ul> because "Use Current Location" is always present
  if (focus && isOrigin) {
    searchResultsUlElement = (
      <ul>
        <li
          onMouseDown={handleGeolocation}
          key="58bfeeaf-5785-4966-9037-b248397608a7"
        >
          Use Current Location
        </li>
        {renderResultsLiElement(results)}
      </ul>
    );
  }

  // Destination search results
  // If on focus, <ul> itself is not rendered unless there are results
  else if (focus && !isOrigin && results.length > 0 && value.length > 1) {
    searchResultsUlElement = <ul>{renderResultsLiElement(results)}</ul>;
  }

  return <React.Fragment>{searchResultsUlElement}</React.Fragment>;
};

export default SearchResults;
