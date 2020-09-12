import React from "react";

import { useSearchState } from "../context/SearchContext/";
import SetTimeForm from "./SetTimeForm";
import Itinerary from "./Itinerary";
import "./index.css";

const Itineraries = () => {
  const { itineraries } = useSearchState();

  return (
    // Render SetTimeForm and Itinerary if there are search results
    <>
      {itineraries.length > 0 ? (
        <div className="itineraries-container">
          <h1>Itineraries</h1>
          <SetTimeForm />
          <ul className="itineraries">
            {itineraries.map((itinerary) => (
              <Itinerary key={itinerary["id"]} itinerary={itinerary} />
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default Itineraries;
