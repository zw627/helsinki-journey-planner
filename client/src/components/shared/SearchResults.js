import React from "react";

const SearchResults = (props) => {
  function renderResults() {
    // Render results if available
    // and search value has more than 2 characters
    if (props.searchResults.length > 0 && props.searchValue.length > 2)
      return props.searchResults.map((result) => {
        const id = result["id"];
        const namePriamry = result["labelPriamry"];
        const nameSecondary = result["labelSecondary"];

        return (
          <li onMouseDown={() => props.handleSelectedResult(result)} key={id}>
            {namePriamry}
            <span>{nameSecondary}</span>
          </li>
        );
      });
  }

  function renderWrapper() {
    let wrapper;

    // Origin search results
    // If on focus, show <ul> because "Use Current Location" is always present
    if (props.isFocus && props.isOrigin) {
      wrapper = (
        <ul>
          <li
            onMouseDown={props.handleGeolocation}
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
      props.isFocus &&
      !props.isOrigin &&
      props.searchResults.length > 0 &&
      props.searchValue.length > 2
    ) {
      wrapper = <ul>{renderResults()}</ul>;
    }

    return wrapper;
  }

  return <React.Fragment>{renderWrapper()}</React.Fragment>;
};

export default SearchResults;
