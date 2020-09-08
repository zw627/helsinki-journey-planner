import React, { useState, useRef } from "react";
import axios from "axios";

import SearchResults from "./SearchResults";
import { getFormattedDate, getFormattedTime } from "../../utils";

const SearchBar = (props) => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [focus, setFocus] = useState(false);
  const [selected, setSelected] = useState({
    name: "",
    coordinates: { lat: 0.0, lon: 0.0 },
  });

  const searchBarInputRef = useRef(null);

  function handleFocus() {
    setFocus(true);
  }

  function handleBlur() {
    // Out of focus unmounts the results list
    setFocus(false);

    // Preserve if an address is selected
    if (
      selected["name"] &&
      selected["coordinates"]["lat"] &&
      selected["coordinates"]["lon"]
    ) {
      setValue(selected["name"]);
    }

    // Reset if no valid address is selected
    else if (
      !(
        selected["name"] ||
        selected["coordinates"]["lat"] ||
        selected["coordinates"]["lon"]
      )
    ) {
      setValue("");
      setResults([]);
      setSelected({
        name: "",
        coordinates: { lat: 0.0, lon: 0.0 },
      });
      props.setItineraries([]);
    }
  }

  async function fetchResults(text) {
    try {
      const res = await axios.post("/api/address-search", {
        text,
      });
      setResults(res.data);
      props.setNotification({
        isPositive: false,
        text: "",
      });

      // Always save the first search result automatically
      // if (res.data.length > 0) {
      //   const firstResult = {
      //     name: res.data[0]["labelPriamry"],
      //     coordinates: res.data[0]["coordinates"],
      //   };
      //   setSelected(firstResult);
      //   props.setAddress(firstResult);
      // }
    } catch (err) {
      setResults([]);
      props.setNotification({
        isPositive: false,
        text: err.response.data.message,
      });
    }
  }

  function handleInput(e) {
    // Enforce singple space ("aalto  yliopisto" => "aalto yliopisto" )
    const filteredInput = e.target.value.replace(/ +/g, " ");
    setValue(filteredInput);

    // Reset if users delete "Your current location"
    if (selected["name"] === "Your current location") {
      setValue("");
      setSelected({
        name: "",
        coordinates: { lat: 0.0, lon: 0.0 },
      });
      props.setAddress({});
    }

    // Show results if input has less than 2 characters
    else if (value.length < 2) {
      setResults([]);
    }

    // Fetch if input has more than 2 characters
    else if (value.length > 1) {
      fetchResults(value);
    }
  }

  function handleGeolocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geoResult = {
            name: "Your current location",
            coordinates: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            },
          };

          // Show "Your current location", set coordinates and selected
          // clear results, focus, error
          setValue(geoResult["name"]);
          setSelected(geoResult);
          setResults([]);
          setFocus(false);
          props.setNotification({ isPositive: false, text: "" });
          props.setAddress(geoResult);

          // Origin: Fetch routes if desination is valid
          if (props.isOrigin && props.destination) {
            props.handleSetItineraries(
              geoResult,
              props.destination,
              getFormattedDate(),
              getFormattedTime()
            );
          }
        },
        (err) => {
          props.setNotification({ isPositive: false, text: err.message });
        }
      );
    }
  }

  function handleSelect(address) {
    const selectedResult = {
      name: address["labelPriamry"],
      coordinates: address["coordinates"],
    };

    // Show address name, set coordinates and selected
    // clear results, focus, error
    setValue(selectedResult["name"]);
    setSelected(selectedResult);
    setFocus(false);
    props.setNotification({ isPositive: false, text: "" });
    props.setAddress(selectedResult);

    // // Origin: Fetch routes automatically if destination is valid
    // if (props.isOrigin && props.destination) {
    //   props.handleSetItineraries(
    //     selectedResult,
    //     props.destination,
    //     getFormattedDate(),
    //     getFormattedTime()
    //   );
    // }

    // // Desination: Fetch routes automatically if origin is valid
    // else if (!props.isOrigin && props.origin) {
    //   props.handleSetItineraries(
    //     props.origin,
    //     selectedResult,
    //     getFormattedDate(),
    //     getFormattedTime()
    //   );
    // }
  }

  // Handle "enter" and "return" keys
  function hanldeKeyDown(e) {
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
  }

  // Reset input and its related data, then focus on input
  function handleReset() {
    setValue("");
    setSelected({
      name: "",
      coordinates: { lat: 0.0, lon: 0.0 },
    });
    setResults([]);
    props.setNotification({ isPositive: false, text: "" });
    props.setAddress({});
    props.setItineraries([]);
    setTimeout(() => {
      searchBarInputRef.current.focus();
    }, 10);
  }

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
