import React from "react";
import PropTypes from "prop-types";
import FiberManualRecordOutlinedIcon from "@material-ui/icons/FiberManualRecordOutlined";

import { getHoursMinutes } from "../../../../utils/index";
import TripIcon from "../../../shared/TripIcon";
import "./index.css";

const ItineraryDetails = ({ leg, isLast }) => {
  const startTime = getHoursMinutes(leg["startTime"]);
  const endTime = getHoursMinutes(leg["endTime"]);

  // e.g. "Aalto-yliopisto E0003", "Origin", or "Destination"
  function getLocation() {
    const stop = leg["from"]["stop"];
    const locationName = leg["from"]["name"];

    if (stop) {
      const stopName = stop["name"];
      const stopCode = stop["code"];
      const stopZone = stop["zoneId"];
      return (
        <React.Fragment>
          {stopName} <span>{stopCode}</span> <span>Zone {stopZone}</span>
        </React.Fragment>
      );
    }

    return locationName;
  }

  // e.g. "M1 Vuosaari" or "(WalkIcon) 43 m"
  function getTrip() {
    const trip = leg["trip"];
    const distance = leg["distance"];

    if (trip) {
      const line = trip["routeShortName"];
      const lineDestination = trip["tripHeadsign"];
      return (
        <React.Fragment>
          <span>{line}</span>
          {lineDestination}
        </React.Fragment>
      );
    }

    return `${distance} m`;
  }

  return (
    <React.Fragment>
      <ul className="itinerary-details-leg">
        <h3>{getLocation()}</h3>
        <li>
          <TripIcon text={leg["mode"]} className="itinerary-details-leg-icon" />{" "}
          {getTrip()}
        </li>
        <li>
          {startTime} - {endTime}
        </li>
        <li>About {leg["duration"]} min</li>
        <FiberManualRecordOutlinedIcon className="litinerary-waypoint" />
        <svg
          className="litinerary-waypoint-connection"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 156.5"
        >
          <title>Waypoint Connection Line</title>
          <line
            x1="5"
            y1="5"
            x2="5"
            y2="5"
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="10"
          />
          <line
            x1="5"
            y1="23.3125"
            x2="5"
            y2="142.3438"
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="10"
            strokeDasharray="0 18.3125"
          />
          <line
            x1="5"
            y1="151.5"
            x2="5"
            y2="151.5"
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeMiterlimit="10"
            strokeWidth="10"
          />
        </svg>
      </ul>
      {
        // Render Destination if it's the last trip
        isLast ? (
          <ul className="itinerary-details-leg">
            <h3>Destination</h3>
            <FiberManualRecordOutlinedIcon className="litinerary-waypoint" />
          </ul>
        ) : null
      }
    </React.Fragment>
  );
};

ItineraryDetails.propTypes = {
  leg: PropTypes.object,
  isLast: PropTypes.bool.isRequired,
};

export default ItineraryDetails;
