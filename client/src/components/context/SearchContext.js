import React, { useState } from "react";
import { withRouter } from "react-router";
import Axios from "axios";

import { hasInvalidValue } from "../../utils";

const SearchContext = React.createContext();

const SearchProvider = ({ children, history }) => {
  const [origin, setOrigin] = useState({
    name: "",
    coordinates: { lat: 0.0, lon: 0.0 },
  });
  const [destination, setDestination] = useState({
    name: "",
    coordinates: { lat: 0.0, lon: 0.0 },
  });
  const [itineraries, setItineraries] = useState([]);
  const [notification, setNotification] = useState({
    isPositive: false,
    text: "",
  });

  // Pass all data as parameters instead of using states
  // to avoid fetch is triggered before useState
  async function fetchItineraries(origin, destination, date, time) {
    try {
      // If all params are valid
      if (
        !hasInvalidValue(origin) &&
        !hasInvalidValue(destination) &&
        date &&
        time
      ) {
        let originName = origin["name"];
        let destName = destination["name"];
        const originCoordinates = origin["coordinates"];
        const destCoordinates = destination["coordinates"];

        // Fetch
        const res = await Axios.post(
          process.env.REACT_APP_API_ITINERARY_PLANNING,
          {
            origin: {
              coordinates: originCoordinates,
            },
            destination: {
              coordinates: destCoordinates,
            },
            date,
            time,
          }
        );
        setItineraries(res.data);

        // If geolocation, fetch name of the coordinates
        if (originName === "Your current location") {
          originName = await fetchAddressName(originCoordinates);
        } else if (destName === "Your current location") {
          destName = await fetchAddressName(destCoordinates);
        }

        // Push params to URL
        const query = `origin-name=${originName}&origin-lat=${originCoordinates["lat"]}&origin-lon=${originCoordinates["lon"]}&destination-name=${destName}&destination-lat=${destCoordinates["lat"]}&destination-lon=${destCoordinates["lon"]}&date=${date}&time=${time}`;
        const encodedQuery = `?${encodeURIComponent(query)}`;
        history.push({ search: encodedQuery });

        // Update title
        document.title = `Helsinki Journey Planner - ${originName} to ${destName}`;
      }
    } catch (err) {
      // Do not unmount the current itineraries if exists (set time)
      if (!itineraries.length > 0) setItineraries([]);
      setNotification({ isPositive: false, text: err.response.data.message });
    }
  }

  async function fetchAddressName(coordinates) {
    try {
      const res = await Axios.post(
        process.env.REACT_APP_API_ADDRESS_LOOKUP,
        coordinates
      );
      const name = res.data[0]["labelPriamry"];
      console.log(name);
      return name;
    } catch (err) {}
  }

  return (
    <SearchContext.Provider
      value={{
        origin,
        destination,
        notification,
        itineraries,
        actions: {
          setOrigin,
          setDestination,
          setNotification,
          setItineraries,
          fetchItineraries,
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default withRouter(SearchProvider);
export const SearchConsumer = SearchContext.Consumer;
