import React from "react";
import NavigateNextRoundedIcon from "@material-ui/icons/NavigateNextRounded";

import TripIcon from "../../../shared/TripIcon";
import { getHoursMinutes } from "../../../../utils";
import "./index.css";

const ItinerarySummary = ({ itinerary }) => {
  // Itineray Time
  // 01:37 - 02:03 (26 min)
  const duration = `${getHoursMinutes(
    itinerary["startTime"]
  )} - ${getHoursMinutes(itinerary["endTime"])} (${itinerary["duration"]} min)`;

  // Itineray Trips
  // WalkIcon > BusIcon 550 > BusIcon 39N > WalkIcon
  const trips = itinerary["trips"].map((trip, index) => {
    return (
      <span className="itinerary-summary-trip" key={trip["id"]}>
        <TripIcon text={trip["mode"]} className="" />
        {trip["trip"] ? (
          <span className="trips-public-transport-line">
            {trip["trip"]["routeShortName"]}
          </span>
        ) : null}
        {index < itinerary["trips"].length - 1 ? (
          <NavigateNextRoundedIcon className="trips-seperator" />
        ) : null}
      </span>
    );
  });

  // The first public transport to catch
  // 01:42 from Otaranta E2204
  const firstPublicTransportTrip = (
    <React.Fragment>
      {getHoursMinutes(itinerary["firstPublicTransportTrip"]["startTime"])} from{" "}
      {itinerary["firstPublicTransportTrip"]["stop"]["name"]}{" "}
      <span>{itinerary["firstPublicTransportTrip"]["stop"]["code"]}</span>
    </React.Fragment>
  );

  return (
    <div className="itinerary-summary">
      <div>{duration}</div>
      <div>{trips}</div>
      <div>{firstPublicTransportTrip}</div>
      <div>
        <TripIcon text="WALK" /> {itinerary["walkDistance"]} m
      </div>
    </div>
  );
};

export default ItinerarySummary;
