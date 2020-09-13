import React from "react";

import SetTimeForm from "./SetTimeForm";
import Itinerary from "./Itinerary";
import Loading from "../shared/Loading";
import { useSearchState } from "../context/SearchContext/";
import "./index.css";

const Itineraries = () => {
  const { itineraries } = useSearchState();

  return (
    // Render SetTimeForm and Itinerary if there are search results
    <>
      {itineraries.length > 0 ? (
        <div className="itineraries-container">
          <h1>
            Itineraries
            <Loading />
          </h1>
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
