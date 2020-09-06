import React, { useState } from "react";
import axios from "axios";

import { SearchFormConsumer } from "../context/SearchFormContext";

const SearchInput = (props) => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [focus, setFocus] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState({});

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    // Out of focus will unmount the results list
    setFocus(false);

    // Preserve original input value if users did not select a new address
    // to force users to always select a valid address from the search results
    if (
      selected["name"] &&
      selected["coordinates"]["lat"] &&
      selected["coordinates"]["lon"]
    ) {
      setValue(selected["name"]);
    }

    // Reset input value if no address is currently selected
    // to force users to always select a valid address from the search results
    else if (!(selected["name"] || selected["coordinates"])) {
      setValue("");
      setResults([]);
      setSelected({});
    }
  };

  return (
    <SearchFormConsumer>
      {({ actions }) => {
        const handleInputValue = async (e) => {
          const filteredInput = e.target.value.replace(/ +/g, " ");
          setValue(filteredInput);

          // Reset input value, selected and origin
          // if users want to remove "Your current location"
          if (selected["name"] === "Your current location") {
            setValue("");
            setSelected({});
            actions.setOrigin({});
          }

          // Input has more than 2 characters
          else if (value.length > 1) {
            // Fetch, update results, clear error
            try {
              const res = await axios.post("/api/address-search", {
                text: value,
              });
              setResults(res.data);
              setError("");
            } catch (err) {
              // Clear results, get API error message
              setResults([]);
              setError(err.response.data.message);
            }
          }

          // Clear results list if input has less than 2 characters
          else {
            setResults([]);
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
                actions.setOrigin(geoCoordinates);
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
          setResults([]);
          setFocus(false);
          setError("");

          props.isOrigin
            ? actions.setOrigin(address["coordinates"])
            : actions.setDestination(address["coordinates"]);
        };

        const hanldeKeyDown = (e) => {
          // Press "enter" or "return" selects the first search result
          if ((e.key === 13 || e.key === "Enter") && results.length > 0) {
            handleSelect(results[0]);
          }

          // Press return""enter" or "return" will select "Use Current Location"
          // if it is origin and there is no results
          else if (
            (e.key === 13 || e.key === "Enter") &&
            results.length === 0 &&
            props.isOrigin
          ) {
            handleGeolocation();
          }
        };

        // Reset input and its related things completely
        const reset = () => {
          setValue("");
          setSelected({});
          setResults([]);
          setError("");
          props.isOrigin ? actions.setOrigin({}) : actions.setDestination({});
        };

        return (
          <div className="search-form-input-container">
            <label
              htmlFor={props.isOrigin ? "origin-input" : "destination-input"}
            >
              {props.isOrigin ? "Origin" : "Destination"}
            </label>
            <div>
              <input
                type="text"
                id={props.isOrigin ? "origin-input" : "destination-input"}
                placeholder={
                  props.isOrigin
                    ? "e.g. Helsingin rautatieasema"
                    : "e.g. Helsinki-Vantaan lentoasema"
                }
                value={value}
                onChange={handleInputValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={hanldeKeyDown}
                autoComplete="off"
              />
              {focus ? <span onMouseDown={reset}>✖</span> : null}
            </div>
            {
              // On focus, always render <ul> and "Use Current Location"
              // for Origin input
              focus && props.isOrigin ? (
                <ul>
                  <li
                    onMouseDown={handleGeolocation}
                    key="58bfeeaf-5785-4966-9037-b248397608a7"
                  >
                    Use Current Location
                  </li>
                  {results.map((address) => (
                    <li
                      onMouseDown={() => handleSelect(address)}
                      key={address["id"]}
                    >
                      {address["labelPriamry"]}
                      <span>{address["labelSecondary"]}</span>
                    </li>
                  ))}
                </ul>
              ) : // <ul> is not rendered unless all conditions are met
              // for Destination input
              focus && results.length > 0 && value.length > 1 ? (
                <ul>
                  {results.map((address) => (
                    <li
                      onMouseDown={() => handleSelect(address)}
                      key={address["id"]}
                    >
                      {address["labelPriamry"]}
                      <span>{address["labelSecondary"]}</span>
                    </li>
                  ))}
                </ul>
              ) : null
            }
          </div>
        );
      }}
    </SearchFormConsumer>
  );
};

export default SearchInput;
