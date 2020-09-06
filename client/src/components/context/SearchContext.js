import React, { useState } from "react";
import axios from "axios";

const SearchContext = React.createContext();

const SearchProvider = ({ children }) => {
  const [origin, setOrigin] = useState({});
  const [destination, setDestination] = useState({});
  const [itineraries, setItineraries] = useState([]);

  const getItineraries = async (e) => {
    e.preventDefault();
    try {
      if (
        origin["lat"] &&
        origin["lon"] &&
        destination["lat"] &&
        destination["lon"]
      ) {
        // 2020-09-04
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
        const date = `${year}-${month}-${day}`;

        // 11:51:02
        const sec = new Date().getSeconds();
        const min = new Date().getMinutes();
        const hour = new Date().getHours();
        const time = `${hour}:${min}:${sec}`;

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
        actions: { setOrigin, setDestination, getItineraries },
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
export const SearchConsumer = SearchContext.Consumer;
