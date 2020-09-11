import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import SearchResults from "./SearchResults/";
import useQueryString from "../../hooks/useQuery";
import useSearchResults from "../../hooks/useSearchResults";
import { debounce, hasInvalidValue } from "../../../utils";

// SearchBar is used by SearchBarDest and SearchBarOrigin
const SearchBar = ({
  isOrigin,
  address,
  setAddress,
  // ---------- //
  oppositeAddress,
  setOppositeAddress,
  // ---------- //
  setNotification,
  setItineraries,
  fetchItineraries,
  // ---------- //
  history,
}) => {
  // Local states
  const [searchValue, setSearchValue] = useState("");
  const [isFocus, setFocus] = useState(false);
  const [isInitializing, setInitializing] = useState(true);

  // Custom hooks
  const searchResults = useSearchResults(searchValue);
  const [queryObject] = useState(useQueryString(isInitializing));

  // Refs
  const inputRef = useRef(null);

  const debounceSearchValue = debounce((value) => {
    setSearchValue(value);
  }, 300);

  function selectResult(address) {
    const filteredAddress = {
      name: address["labelPriamry"],
      coordinates: address["coordinates"],
    };

    // Set
    setAddress(filteredAddress);
    inputRef.current.value = filteredAddress["name"];

    // Clear
    setFocus(false);
    setItineraries([]);
    setNotification({ isPositive: false, text: "" });
  }

  function getGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Only one input has geo at the same time
          if (oppositeAddress["name"] === "Your current location") {
            setOppositeAddress({
              name: "",
              coordinates: {
                lat: 0,
                lon: 0,
              },
            });
            const id = isOrigin ? "destination-input" : "origin-input";
            // Input value cannot be bind to state due to debouncing
            document.getElementById(id).value = "";
          }

          // Set
          selectResult({
            labelPriamry: "Your current location",
            coordinates: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          });
        },
        (err) => {
          // If permission denied
          setNotification({ isPositive: false, text: err.message });
        }
      );
    } else {
      // If "geolocation" not in navigator
      setNotification({
        isPositive: false,
        text: "Geolocation is not supported.",
      });
    }
  }

  function handleFocus() {
    setFocus(true);
  }

  function handleBlur() {
    setFocus(false);

    // Preserve value if an address is selected
    if (!hasInvalidValue(address)) {
      inputRef.current.value = address["name"];
    }
    // Clear if no address is selected
    else {
      setSearchValue("");
      setAddress({
        name: "",
        coordinates: { lat: 0.0, lon: 0.0 },
      });
      setItineraries([]);
      inputRef.current.value = "";
    }
  }

  function handleKeyDown(e) {
    // Handle "Enter" and "Return" keys
    const isEnterOrReturn = e.key === 13 || e.key === "Enter";
    const blurInput = () => {
      setTimeout(() => {
        inputRef.current.blur();
      }, 10);
    };

    // Select the first search result
    if (isEnterOrReturn && searchResults.length > 0) {
      selectResult(searchResults[0]);
      blurInput();
    }
    // Select "Use Current Location" (if no search result)
    else if (isEnterOrReturn && searchResults.length === 0) {
      getGeolocation();
      blurInput();
    }
  }

  function handleReset() {
    // Reset input and search value
    setSearchValue("");
    inputRef.current.value = "";

    // Reset notification, address object, itineraries
    setNotification({ isPositive: false, text: "" });
    setAddress({ name: "", coordinates: { lat: 0.0, lon: 0.0 } });
    setItineraries([]);

    // Reset URL params
    history.push({ search: "" });

    // Focus input
    setTimeout(() => {
      inputRef.current.focus();
    }, 10);
  }

  useEffect(() => {
    let { origin, destination, date, time } = queryObject;
    const address = isOrigin ? origin : destination;

    // Set based on URL params if first visit
    if (isInitializing && !hasInvalidValue(address)) {
      setSearchValue(address["name"]);
      setAddress(address);
      setInitializing(false);
      inputRef.current.value = address["name"];

      // Fetch itineraries if all params are valid
      if (isOrigin && !hasInvalidValue(destination)) {
        fetchItineraries(origin, destination, date, time);
      }
    }
  }, [queryObject, isInitializing, fetchItineraries, isOrigin, setAddress]);

  // Set JSX elements for SearchBarDest or SearchBarOrigin conditionally
  const labelText = isOrigin ? "Origin" : "Destination";
  const inputId = isOrigin ? "origin-input" : "destination-input";
  const inputPlaceholder = isOrigin
    ? "e.g. Helsingin rautatieasema"
    : "e.g. Helsinki-Vantaan lentoasema";

  return (
    <div className="search-bar-container">
      <label htmlFor={inputId}>{labelText}</label>
      <div>
        <input
          type="text"
          id={inputId}
          placeholder={inputPlaceholder}
          ref={inputRef}
          onChange={(e) => debounceSearchValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {isFocus ? <span onMouseDown={handleReset}>✖</span> : null}
      </div>
      {isFocus ? (
        <SearchResults
          isOrigin={isOrigin}
          searchValue={searchValue}
          searchResults={searchResults}
          selectResult={selectResult}
          getGeolocation={getGeolocation}
        />
      ) : null}
    </div>
  );
};

SearchBar.propTypes = {
  isOrigin: PropTypes.bool.isRequired,
  address: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  // ------------------------- //
  oppositeAddress: PropTypes.object.isRequired,
  setOppositeAddress: PropTypes.func.isRequired,
  // ------------------------- //
  setNotification: PropTypes.func.isRequired,
  setItineraries: PropTypes.func.isRequired,
  fetchItineraries: PropTypes.func.isRequired,
};

export default withRouter(SearchBar);
