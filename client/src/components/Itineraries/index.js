import React from "react";

import { SearchConsumer } from "../context/SearchContext";
import SetTimeForm from "./SetTimeForm";
import Itinerary from "./Itinerary";
import "./index.css";

const ItinerariesWrapper = () => (
  <SearchConsumer>
    {({ origin, destination, itineraries, actions }) => (
      <Itineraries
        origin={origin}
        destination={destination}
        itineraries={itineraries}
        setItineraries={actions.setItineraries}
        handleSetItineraries={actions.handleSetItineraries}
      />
    )}
  </SearchConsumer>
);

// Render SetTimeForm and Itinerary if there are search results
const Itineraries = (props) =>
  props.itineraries.length > 0 ? (
    <div className="itineraries-container">
      <h1>Itineraries</h1>
      <SetTimeForm
        origin={props.origin}
        destination={props.destination}
        setItineraries={props.setItineraries}
        handleSetItineraries={props.handleSetItineraries}
      />
      <ul className="itineraries">
        {props.itineraries.map((itinerary) => (
          <Itinerary key={itinerary["id"]} itinerary={itinerary} />
        ))}
      </ul>
    </div>
  ) : null;

export default ItinerariesWrapper;
