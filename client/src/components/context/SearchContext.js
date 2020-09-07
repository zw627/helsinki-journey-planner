import React, { useState } from "react";
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

  // Pass all data as parameters instead of using states
  // to avoid fetch is triggered before useState
  const handleSetItineraries = async (origin, destination, date, time) => {
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
      console.log(err.response.data.message);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        origin,
        destination,
        itineraries,
        actions: {
          setOrigin,
          setDestination,
          handleSetItineraries,
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
export const SearchConsumer = SearchContext.Consumer;
