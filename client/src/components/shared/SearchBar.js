import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import SearchResults from "./SearchResults";
import { debounce } from "../../utils";

// SearchBar is used by SearchBarDest and SearchBarOrigin
const SearchBar = ({
  isOrigin,
  address,
  oppositeAddress,
  setAddress,
  setOppositeAddress,
  setNotification,
  setItineraries,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFocus, setFocus] = useState(false);
  const searchBarInputRef = useRef(null);

  // Debounce to avoid API call on key up
  const handleSearchValue = debounce((value) => {
    setSearchValue(value);
  }, 300);

  // Fetch and set results
  async function handleSearchResults(value) {
    try {
      const res = await axios.post(process.env.REACT_APP_API_ADDRESS_SEARCH, {
        text: value,
      });
      setSearchResults(res.data);
    } catch (err) {
      setSearchResults([]);
    }
  }

  // Select a result
  function handleSelectedResult(address) {
    const filteredAddress = {
      name: address["labelPriamry"],
      coordinates: address["coordinates"],
    };

    // Set input value
    searchBarInputRef.current.value = filteredAddress["name"];

    // Set address object
    setAddress(filteredAddress);

    // Clear focus, error, and old itineraries
    setFocus(false);
    setNotification({ isPositive: false, text: "" });
    setItineraries([]);
  }

  function handleFocus() {
    setFocus(true);
  }

  function handleBlur() {
    setFocus(false);
    const name = address["name"];
    const lat = address["coordinates"]["lat"];
    const lon = address["coordinates"]["lon"];

    // Preserve input and search value (if an address is selected)
    if (name && lat && lon) {
      searchBarInputRef.current.value = name;
    }

    // Reset (if no valid address is selected)
    else if (!(name || lat || lon)) {
      // Reset input and search value
      setSearchValue("");
      searchBarInputRef.current.value = "";

      // Reset search results, selected result, address, itineraries
      setSearchResults([]);
      setAddress({
        name: "",
        coordinates: { lat: 0.0, lon: 0.0 },
      });
      setItineraries([]);
    }
  }

  function handleGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const filteredAddress = {
            name: "Your current location",
            coordinates: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          };

          // Set search and input value
          searchBarInputRef.current.value = filteredAddress["name"];

          // Set address object
          if (oppositeAddress["name"] === "Your current location") {
            setOppositeAddress({
              name: "",
              coordinates: { lat: 0.0, lon: 0.0 },
            });
          }
          setAddress(filteredAddress);

          // Clear focus, search results and error
          setFocus(false);
          setSearchResults([]);
          setNotification({ isPositive: false, text: "" });
        },

        // Send notification if there is error
        (err) => {
          setNotification({ isPositive: false, text: err.message });
        }
      );
    }
  }

  function hanldeKeyDown(e) {
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
    else if (isEnterOrReturn && searchResults.length === 0 && isOrigin) {
      handleGeolocation();
      blurInput();
    }
  }

  function handleReset() {
    // Reset input and search value
    setSearchValue("");
    searchBarInputRef.current.value = "";

    // Reset search results and selected result
    setSearchResults([]);

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
    // Fetch search results
    if (searchValue.length > 2) {
      handleSearchResults(searchValue);
    }
  }, [searchValue]);

  // For SearchBarDest and SearchBarOrigin
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
          onChange={(e) => handleSearchValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={hanldeKeyDown}
          ref={searchBarInputRef}
          autoComplete="off"
        />
        {isFocus ? <span onMouseDown={handleReset}>✖</span> : null}
      </div>
      <SearchResults
        isOrigin={isOrigin}
        searchValue={searchValue}
        searchResults={searchResults}
        isFocus={isFocus}
        handleGeolocation={handleGeolocation}
        handleSelectedResult={handleSelectedResult}
      />
    </div>
  );
};

SearchBar.propTypes = {
  isOrigin: PropTypes.bool.isRequired,
  address: PropTypes.object.isRequired,
  oppositeAddress: PropTypes.object.isRequired,
  setAddress: PropTypes.func.isRequired,
  setOppositeAddress: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
  setItineraries: PropTypes.func.isRequired,
};

export default SearchBar;
