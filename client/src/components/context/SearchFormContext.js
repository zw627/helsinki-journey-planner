import React, { useState } from "react";
import axios from "axios";

const SearchFormContext = React.createContext();

const SearchFormProvider = ({ children }) => {
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
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
        const date = `${year}-${month}-${day}`;

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
    <SearchFormContext.Provider
      value={{
        itineraries,
        actions: { setOrigin, setDestination, getItineraries },
      }}
    >
      {children}
    </SearchFormContext.Provider>
  );
};

export default SearchFormProvider;
export const SearchFormConsumer = SearchFormContext.Consumer;
