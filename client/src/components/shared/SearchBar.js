import React, { useState, useRef } from "react";
import axios from "axios";

import SearchResults from "./SearchResults";

const SearchBar = (props) => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [focus, setFocus] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState({});

  const searchBarInputRef = useRef(null);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    // Out of focus will unmount the results list
    setFocus(false);

    // onBlur preserves the selected address
    if (
      selected["name"] &&
      selected["coordinates"]["lat"] &&
      selected["coordinates"]["lon"]
    ) {
      setValue(selected["name"]);
    }

    // onBlur resets everything if no valid address is selected
    else if (!(selected["name"] || selected["coordinates"])) {
      setValue("");
      setResults([]);
      setSelected({});
    }
  };

  const handleInput = async (e) => {
    // Enforce singple space ("aalto  yliopisto" => "aalto yliopisto" )
    const filteredInput = e.target.value.replace(/ +/g, " ");
    setValue(filteredInput);

    // Reset when users want to delete "Your current location"
    if (selected["name"] === "Your current location") {
      setValue("");
      setSelected({});
      props.setAddress({});
    }

    // Keep results empty if input has less than 2 characters
    else if (value.length < 2) {
      setResults([]);
    }

    // Fetch if input has more than 2 characters
    else if (value.length > 1) {
      try {
        const res = await axios.post("/api/address-search", {
          text: value,
        });
        setResults(res.data);

        // Always save the first search result automatically
        // if (res.data.length > 0) {
        //   setSelected({
        //     name: res.data[0]["labelPriamry"],
        //     coordinates: res.data[0]["coordinates"],
        //   });
        //   props.setAddress(res.data[0]["coordinates"]);
        // }

        setError("");
      } catch (err) {
        setResults([]);
        setError(err.response.data.message);
      }
    }
  };

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geoCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };

          // Show "Your current location", set coordinates and selected
          // clear results, focus, error
          setValue("Your current location");
          setSelected({
            name: "Your current location",
            coordinates: geoCoordinates,
          });
          setResults([]);
          setFocus(false);
          setError("");

          // Get my location is origin only
          props.setAddress(geoCoordinates);
        },
        (err) => {
          setError(err.message);
        }
      );
    }
  };

  const handleSelect = (address) => {
    // Show address name, set coordinates and selected
    // clear results, focus, error
    setValue(address["labelPriamry"]);
    setSelected({
      name: address["labelPriamry"],
      coordinates: address["coordinates"],
    });
    setFocus(false);
    setError("");

    props.setAddress(address["coordinates"]);
  };

  // Handle "enter" and "return" keys
  const hanldeKeyDown = (e) => {
    // Select the first search result
    if ((e.key === 13 || e.key === "Enter") && results.length > 0) {
      handleSelect(results[0]);
      setTimeout(() => {
        searchBarInputRef.current.blur();
      }, 10);
    }

    // Select "Use Current Location" (when no search result)
    else if (
      (e.key === 13 || e.key === "Enter") &&
      results.length === 0 &&
      props.isOrigin
    ) {
      handleGeolocation();
      setTimeout(() => {
        searchBarInputRef.current.blur();
      }, 10);
    }
  };

  // Reset input and its related data, then focus on input
  const handleReset = () => {
    setValue("");
    setSelected({});
    setResults([]);
    setError("");
    props.setAddress({});
    setTimeout(() => {
      searchBarInputRef.current.focus();
    }, 10);
  };

  const labelText = props.isOrigin ? "Origin" : "Destination";
  const inputId = props.isOrigin ? "origin-input" : "destination-input";
  const inputPlaceholder = props.isOrigin
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
          value={value}
          onChange={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={hanldeKeyDown}
          ref={searchBarInputRef}
          autoComplete="off"
        />
        {focus ? <span onMouseDown={handleReset}>✖</span> : null}
      </div>
      <SearchResults
        isOrigin={props.isOrigin}
        value={value}
        focus={focus}
        results={results}
        handleGeolocation={handleGeolocation}
        handleSelect={handleSelect}
      />
    </div>
  );
};

export default SearchBar;