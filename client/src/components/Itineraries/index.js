import React from "react";

import { SearchConsumer } from "../context/SearchContext";
import SetTimeForm from "./SetTimeForm";
import Itinerary from "./Itinerary";
import "./index.css";

// Render SetTimeForm and Itinerary if there are search results
const Itineraries = ({
  origin,
  destination,
  itineraries,
  handleSetItineraries,
}) =>
  itineraries.length > 0 ? (
    <div className="itineraries-container">
      <h1>Itineraries</h1>
      <SetTimeForm
        origin={origin}
        destination={destination}
        handleSetItineraries={handleSetItineraries}
      />
      <ul className="itineraries">
        {itineraries.map((itinerary) => (
          <Itinerary key={itinerary["id"]} itinerary={itinerary} />
        ))}
      </ul>
    </div>
  ) : null;

const ItinerariesWrapper = () => (
  <SearchConsumer>
    {({ origin, destination, itineraries, actions }) => (
      <Itineraries
        origin={origin}
        destination={destination}
        itineraries={itineraries}
        handleSetItineraries={actions.handleSetItineraries}
      />
    )}
  </SearchConsumer>
);

export default ItinerariesWrapper;
