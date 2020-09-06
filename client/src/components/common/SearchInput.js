import React, { useState } from "react";
import axios from "axios";

import { SearchFormConsumer } from "../context/SearchFormContext";

const SearchInput = (props) => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [focus, setFocus] = useState(false);
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState({});

  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    // Out of focus to unmount the results list
    setFocus(false);

    // If coordinates are invalid, clear the input value,
    // to force users to search again and select a valid address
    if (!(coordinates["lat"] || coordinates["lon"])) {
      setValue("");
      setResults([]);
    }
  };

  return (
    <SearchFormConsumer>
      {({ actions }) => {
        const handleInputValue = async (e) => {
          const filteredInput = e.target.value;
          setValue(filteredInput);

          // If users change the input, clear the coordinates,
          // to force users to always select a valid address from the latest results
          setCoordinates({});
          props.isOrigin ? actions.setOrigin({}) : actions.setDestination({});

          // Input has more than 2 characters
          if (value.length > 1) {
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

                // Show "Your current location",
                // set coordinates,
                // clear results, focus, error
                setValue("Your current location");
                setResults([]);
                setFocus(false);
                setError("");
                setCoordinates(geoCoordinates);
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
          // Show "Your current location",
          // set coordinates,
          // clear results, focus, error
          setValue(address["labelPriamry"]);
          setResults([]);
          setFocus(false);
          setError("");
          setCoordinates(address["coordinates"]);

          props.isOrigin
            ? actions.setOrigin(address["coordinates"])
            : actions.setDestination(address["coordinates"]);
        };

        return (
          <div className="input-container">
            <label
              htmlFor={props.isOrigin ? "origin-input" : "destination-input"}
            >
              {props.isOrigin ? "Origin" : "Destination"}
            </label>
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
              autoComplete="off"
            />
            {
              // For origin, when focus
              // always render <ul> and "Use Current Location"
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
              ) : // For destination, <ul> is not rendered
              // unless all conditions are met
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
