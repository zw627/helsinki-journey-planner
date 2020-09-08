import React from "react";
import FiberManualRecordOutlinedIcon from "@material-ui/icons/FiberManualRecordOutlined";

import { getHoursMinutes } from "../../../../utils/index";
import TripIcon from "../../../shared/TripIcon";
import "./index.css";

const ItineraryDetails = ({ leg, isLast }) => {
  const startTime = getHoursMinutes(leg["startTime"]);
  const endTime = getHoursMinutes(leg["endTime"]);

  // e.g. Aalto-yliopisto E0003
  const getLocation = (key = "from") => {
    if (leg[key]["stop"]) {
      return (
        <h3>
          {leg[key]["stop"]["name"]} <span>{leg[key]["stop"]["code"]}</span>
        </h3>
      );
    }
    return <h3>{leg[key]["name"]}</h3>;
  };

  // e.g. M1 Vuosaari
  const getTrip = () => {
    if (leg["trip"]) {
      return (
        <React.Fragment>
          <span>{leg["trip"]["routeShortName"]}</span>
          {leg["trip"]["tripHeadsign"]}
        </React.Fragment>
      );
    }
    return "Walk";
  };

  return (
    <React.Fragment>
      <ul className="itinerary-details-leg">
        {getLocation()}
        <li>
          <TripIcon text={leg["mode"]} className="itinerary-details-leg-icon" />{" "}
          {getTrip()}
        </li>
        <li>
          {startTime} - {endTime}
        </li>
        <li>
          About {leg["duration"]} min, {leg["distance"]} m
        </li>
        <FiberManualRecordOutlinedIcon className="litinerary-waypoint" />
        <svg
          className="litinerary-waypoint-connection"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 156.5"
        >
          <title>Untitled-1</title>
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

export default ItineraryDetails;
