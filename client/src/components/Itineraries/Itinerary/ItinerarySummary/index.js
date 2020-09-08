import React, { useState } from "react";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";

import TripIcon from "../../../shared/TripIcon";
import { getHoursMinutes } from "../../../../utils";
import "./index.css";

const ItinerarySummary = ({ itinerary }) => {
  // e.g. "01:37 - 02:03 (26 min)"
  function renderTimeDiv() {
    const startTime = getHoursMinutes(itinerary["startTime"]);
    const endTime = getHoursMinutes(itinerary["endTime"]);
    const duration = itinerary["duration"];
    return (
      <div className="itinerary-summary-time">
        {startTime} - {endTime} ({duration} min)
      </div>
    );
  }

  // e.g. "WalkIcon > BusIcon 550 > BusIcon 39N > WalkIcon"
  function renderTripsDiv() {
    const tripsSummary = itinerary["tripsSummary"];

    if (tripsSummary.length > 0)
      return (
        <div className="itinerary-summary-trips">
          {tripsSummary.map((tripSummary, index) => {
            const tripId = tripSummary["id"];
            const tripMode = tripSummary["mode"];
            const trip = tripSummary["trip"];

            // No ">" at the beginning
            const rightArrowIcon = (index) => {
              if (index !== 0)
                return <NavigateNextRoundedIcon className="trips-seperator" />;
            };

            // No public transport line for walk
            const publicTransportLine = (trip) => {
              if (trip)
                return (
                  <span className="trips-public-transport-line">
                    {trip["routeShortName"]}
                  </span>
                );
            };

            // e.g. "WalkIcon > BusIcon 550 > BusIcon 39N > WalkIcon"
            return (
              <span className="itinerary-summary-trip" key={tripId}>
                {rightArrowIcon(index)}
                <TripIcon text={tripMode} className="" />
                {publicTransportLine(trip)}
              </span>
            );
          })}
        </div>
      );
  }

  // e.g. "01:42 from Otaranta E2204"
  function renderFirstPublicTransportDiv() {
    const firstPublicTransport = itinerary["firstPublicTransportTrip"];
    if (firstPublicTransport) {
      const departureTime = getHoursMinutes(firstPublicTransport["startTime"]);
      const stopName = firstPublicTransport["stop"]["name"];
      const stopCode = firstPublicTransport["stop"]["code"];

      return (
        <div className="itinerary-summary-first-public-transport">
          {departureTime} from {stopName} {stopCode}
        </div>
      );
    }
  }

  // e.g. "A B C"
  function getZones() {
    const zones = itinerary["zones"];
    if (zones.length > 0)
      return (
        <React.Fragment>
          <span className="distance-zones-fares-seperator">|</span>
          <div className="itinerary-summary-zones">
            {zones.map((zone) => (
              <span key={itinerary + " " + zone.toLowerCase()}>{zone}</span>
            ))}
          </div>
        </React.Fragment>
      );
  }

  function getFaresSum() {
    const faresSum = itinerary["faresSum"];
    if (faresSum) return <span>€ {faresSum / 100}</span>;
  }

  const walkDistance = (
    <React.Fragment>
      <TripIcon text="WALK" />
      {itinerary["walkDistance"]} m
    </React.Fragment>
  );

  // 01:37 - 02:03 (26 min)
  // WalkIcon > BusIcon [550] > BusIcon [39N] > WalkIcon
  // 01:42 from Otaranta E2204
  // Walk 120 m | [A B C] € 2.8
  return (
    <div className="itinerary-summary">
      {renderTimeDiv()}
      {renderTripsDiv()}
      {renderFirstPublicTransportDiv()}
      <div className="itinerary-summary-distance-zones-fares">
        {walkDistance} {getZones()} {getFaresSum()}
      </div>
    </div>
  );
};

export default ItinerarySummary;
