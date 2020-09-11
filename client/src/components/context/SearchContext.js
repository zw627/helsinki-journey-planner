import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import axios from "axios";

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
  const [originInputValue, setOriginInputValue] = useState("");
  const [destInputValue, setDestInputValue] = useState("");
  const [itineraries, setItineraries] = useState([]);
  const [notification, setNotification] = useState({
    isPositive: false,
    text: "",
  });

  // Pass all data as parameters instead of using states
  // to avoid fetch is triggered before useState
  async function handleSetItineraries(origin, destination, date, time) {
    try {
      if (
        !hasInvalidValue(origin) &&
        !hasInvalidValue(destination) &&
        date &&
        time
      ) {
        const res = await axios.post(
          process.env.REACT_APP_API_ITINERARY_PLANNING,
          {
            origin: {
              coordinates: origin["coordinates"],
            },
            destination: {
              coordinates: destination["coordinates"],
            },
            date,
            time,
          }
        );
        setItineraries(res.data);

        // Push params to URL
        const query = `origin-name=${origin["name"]}&origin-lat=${origin["coordinates"]["lat"]}&origin-lon=${origin["coordinates"]["lon"]}&destination-name=${destination["name"]}&destination-lat=${destination["coordinates"]["lat"]}&destination-lon=${destination["coordinates"]["lon"]}&date=${date}&time=${time}`;
        const encodedQuery = `?${encodeURIComponent(query)}`;
        history.push({
          search: encodedQuery,
        });
      }
    } catch (err) {
      // Do not unmount the current itineraries if exists (set time)
      if (!itineraries.length > 0) setItineraries([]);
      setNotification({ isPositive: false, text: err.response.data.message });
    }
  }

  // For testing purposes
  useEffect(() => {
    // // Kamppi to Railway Station
    // handleSetItineraries(
    //   { coordinates: { lat: 60.169022, lon: 24.931691 } },
    //   { coordinates: { lat: 60.170384, lon: 24.939846 } },
    //   "2020-09-08",
    //   "09:00:00"
    // );
    // // Aalto to Espoo
    // handleSetItineraries(
    //   { coordinates: { lat: 60.18526, lon: 24.829319 } },
    //   { coordinates: { lat: 60.224187, lon: 24.660363 } },
    //   "2020-09-08",
    //   "09:00:00"
    // );
  }, []);

  return (
    <SearchContext.Provider
      value={{
        origin,
        destination,
        originInputValue,
        destInputValue,
        itineraries,
        notification,
        actions: {
          setOrigin,
          setOriginInputValue,
          setDestination,
          setDestInputValue,
          setNotification,
          setItineraries,
          handleSetItineraries,
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default withRouter(SearchProvider);
export const SearchConsumer = SearchContext.Consumer;
