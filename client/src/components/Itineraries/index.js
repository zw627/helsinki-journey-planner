import React from "react";

import { SearchConsumer } from "../context/SearchContext";
import SetTimeForm from "./SetTimeForm";
import Itinerary from "./Itinerary";
import "./index.css";

const Itineraries = () => (
  // Render SetTimeForm and Itinerary if there are search results
  <SearchConsumer>
    {({ origin, destination, itineraries, actions }) =>
      itineraries.length > 0 ? (
        <div className="itineraries-container">
          <h1>Itineraries</h1>
          <SetTimeForm
            origin={origin}
            destination={destination}
            setNotification={actions.setNotification}
            setItineraries={actions.setItineraries}
            fetchItineraries={actions.fetchItineraries}
          />
          <ul className="itineraries">
            {itineraries.map((itinerary) => (
              <Itinerary key={itinerary["id"]} itinerary={itinerary} />
            ))}
          </ul>
        </div>
      ) : null
    }
  </SearchConsumer>
);

export default Itineraries;
