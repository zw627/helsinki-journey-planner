import React from "react";

import { SearchConsumer } from "../context/SearchContext";
import SetTimeForm from "./SetTimeForm";
import Itinerary from "./Itinerary";
import "./index.css";

const Itineraries = () => {
  // Render SetTimeForm and Itinerary if there are search results
  return (
    <SearchConsumer>
      {({ origin, destination, itineraries, actions }) => (
        <React.Fragment>
          {itineraries.length > 0 ? (
            <div className="itineraries-container">
              <h1>Itineraries</h1>
              <SetTimeForm
                origin={origin}
                destination={destination}
                handleSetItineraries={actions.handleSetItineraries}
              />
              <ul className="itineraries">
                {itineraries.map((itinerary) => (
                  <Itinerary itinerary={itinerary} key={itinerary["id"]} />
                ))}
              </ul>
            </div>
          ) : null}
        </React.Fragment>
      )}
    </SearchConsumer>
  );
};

export default Itineraries;
