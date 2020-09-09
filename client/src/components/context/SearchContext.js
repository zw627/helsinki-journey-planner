import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchContext = React.createContext();

const SearchProvider = ({ children }) => {
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
  async function handleSetItineraries(origin, destination, date, time) {
    try {
      if (
        origin["coordinates"]["lat"] &&
        origin["coordinates"]["lon"] &&
        destination["coordinates"]["lat"] &&
        destination["coordinates"]["lon"] &&
        date &&
        time
      ) {
        const res = await axios.post("/api/itinerary-planning", {
          origin: {
            coordinates: origin["coordinates"],
          },
          destination: {
            coordinates: destination["coordinates"],
          },
          date,
          time,
        });
        console.log(res.data);
        setItineraries(res.data);
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
        itineraries,
        notification,
        actions: {
          setOrigin,
          setDestination,
          setItineraries,
          handleSetItineraries,
          setNotification,
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
export const SearchConsumer = SearchContext.Consumer;
