import React, { useState } from "react";

import "./index.css";

const SearchForm = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setdestination] = useState("");

  const handleGeolocation = (e) => {
    e.preventDefault();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Latitude is:", position.coords.latitude);
          console.log("Longitude is:", position.coords.longitude);
        },
        (error) => {
          console.log(error.message);
        }
      );
    }
  };

  const handleDeparture = (e) => {
    const filteredInput = e.target.value;
    setDeparture(filteredInput);
  };

  const handleDestination = (e) => {
    const filteredInput = e.target.value;
    setdestination(filteredInput);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <form>
      <div className="form-departure">
        <label htmlFor="departure-input">Departure</label>
        <input
          type="text"
          id="departure-input"
          placeholder="e.g. Helsingin rautatieasema"
          value={departure}
          onChange={handleDeparture}
        />
        <input
          type="button"
          value="Use Current Location"
          onClick={handleGeolocation}
        />
      </div>

      <div className="form-destination">
        <label htmlFor="destination-input">Destination</label>
        <input
          type="text"
          id="destination-input"
          placeholder="e.g. Helsinki-Vantaan lentoasema"
          value={destination}
          onChange={handleDestination}
        />
      </div>

      <input type="submit" value="Search" onClick={handleSearch} />
    </form>
  );
};

export default SearchForm;
