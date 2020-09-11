import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

import SearchResults from "./SearchResults";
import useQueryString from "../hooks/useQuery";
import useSearchResults from "../hooks/useSearchResults";
import { debounce, hasInvalidValue } from "../../utils";

// SearchBar is used by SearchBarDest and SearchBarOrigin
const SearchBar = ({
  isOrigin,
  address,
  inputValue,
  setAddress,
  setInputValue,
  // ---------- //
  oppositeInput,
  oppositeAddress,
  setOppositeInput,
  setOppositeAddress,
  // ---------- //
  setNotification,
  setItineraries,
  handleSetItineraries,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const searchResults = useSearchResults(searchValue);
  const searchBarInputRef = useRef(null);
  const [isFocus, setFocus] = useState(false);
  const [isInitializing, setInitializing] = useState(true);
  const [queryObject] = useState(useQueryString(isInitializing));

  // Debounce to avoid API call on key up
  const handleSearchValue = debounce((value) => {
    setSearchValue(value);
  }, 300);

  // Handle selecting from results
  function handleSelectedResult(address) {
    const filteredAddress = {
      name: address["labelPriamry"],
      coordinates: address["coordinates"],
    };
    // Set
    setInputValue(filteredAddress["name"]);
    setAddress(filteredAddress);
    searchBarInputRef.current.value = filteredAddress["name"];
    // Clear
    setFocus(false);
    setItineraries([]);
    setNotification({ isPositive: false, text: "" });
  }

  // Geolocation
  function handleGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Only one
          if (oppositeInput === "Your current location") {
            setOppositeAddress({
              name: "",
              coordinates: {
                lat: 0,
                lon: 0,
              },
            });
            const id = isOrigin ? "destination-input" : "origin-input";
            setOppositeInput("");
            document.getElementById(id).value = ""; // Input value cannot be bind due to debouncing
          }

          handleSelectedResult({
            labelPriamry: "Your current location",
            coordinates: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          });
        },
        (err) => {
          setNotification({ isPositive: false, text: err.message });
        }
      );
    } else {
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
      setInputValue(address["name"]);
      searchBarInputRef.current.value = address["name"];
    } else {
      setInputValue("");
      setSearchValue("");
      searchBarInputRef.current.value = "";
      setAddress({
        name: "",
        coordinates: { lat: 0.0, lon: 0.0 },
      });
      setItineraries([]);
    }
  }

  function handleKeyDown(e) {
    // Handle "Enter" and "Return" keys
    const isEnterOrReturn = e.key === 13 || e.key === "Enter";
    // Blur input
    const blurInput = () => {
      setTimeout(() => {
        searchBarInputRef.current.blur();
      }, 10);
    };
    // Select the first search result
    if (isEnterOrReturn && searchResults.length > 0) {
      handleSelectedResult(searchResults[0]);
      blurInput();
    }
    // Select "Use Current Location" (if no search result)
    else if (isEnterOrReturn && searchResults.length === 0) {
      handleGeolocation();
      blurInput();
    }
  }

  function handleReset() {
    // Reset input and search value
    setSearchValue("");
    setInputValue("");
    searchBarInputRef.current.value = "";
    // Reset notification, address object, itineraries
    setNotification({ isPositive: false, text: "" });
    setAddress({ name: "", coordinates: { lat: 0.0, lon: 0.0 } });
    setItineraries([]);
    // Focus input
    setTimeout(() => {
      searchBarInputRef.current.focus();
    }, 10);
  }

  useEffect(() => {
    let { origin, destination, date, time } = queryObject;
    const address = isOrigin ? origin : destination;

    if (isInitializing && !hasInvalidValue(address)) {
      setInputValue(address["name"]);
      setSearchValue(address["name"]);
      setAddress(address);
      setInitializing(false);
      searchBarInputRef.current.value = address["name"];

      if (isOrigin && !hasInvalidValue(destination)) {
        handleSetItineraries(origin, destination, date, time);
      }
    }
  }, [
    queryObject,
    isInitializing,
    handleSetItineraries,
    isOrigin,
    setAddress,
    setInputValue,
  ]);

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
          ref={searchBarInputRef}
          onChange={(e) => handleSearchValue(e.target.value)}
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
          handleSelectedResult={handleSelectedResult}
          handleGeolocation={handleGeolocation}
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
  oppositeInput: PropTypes.string.isRequired,
  oppositeAddress: PropTypes.object.isRequired,
  setOppositeInput: PropTypes.func.isRequired,
  setOppositeAddress: PropTypes.func.isRequired,
  // ------------------------- //
  setNotification: PropTypes.func.isRequired,
  setItineraries: PropTypes.func.isRequired,
  handleSetItineraries: PropTypes.func.isRequired,
};

export default SearchBar;
