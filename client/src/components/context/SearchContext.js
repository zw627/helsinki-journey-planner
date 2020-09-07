import React, { useState } from "react";
import axios from "axios";

const SearchContext = React.createContext();

const SearchProvider = ({ children }) => {
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const [itineraries, setItineraries] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const getItineraries = async () => {
    try {
      if (
        origin["lat"] &&
        origin["lon"] &&
        destination["lat"] &&
        destination["lon"] &&
        date &&
        time
      ) {
        const res = await axios.post("/api/itinerary-planning", {
          origin,
          destination,
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
        itineraries,
        actions: {
          setOrigin,
          setDestination,
          getItineraries,
          setDate,
          setTime,
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
export const SearchConsumer = SearchContext.Consumer;
