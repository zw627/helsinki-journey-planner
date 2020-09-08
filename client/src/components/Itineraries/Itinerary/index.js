import React, { useState } from "react";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";

import ItineraryDetails from "./ItineraryDetails/";
import ItinerarySummary from "./ItinerarySummary/";

import "./index.css";

const Itinerary = ({ itinerary }) => {
  const [isExpanded, setExpand] = useState(false);

  const handleOnclick = () => {
    setExpand(!isExpanded);
  };

  // Render details if it is clicked
  return (
    <li className="itinerary" onClick={handleOnclick}>
      <ItinerarySummary itinerary={itinerary} />
      {isExpanded
        ? itinerary["legs"].map((leg, index) => (
            <ItineraryDetails
              leg={leg}
              isLast={index === itinerary["legs"].length - 1}
              key={leg["id"]}
            />
          ))
        : null}

      <ExpandMoreRoundedIcon
        className={
          isExpanded
            ? "itinerary-expand-icon itinerary-expand-icon-is-expanded"
            : "itinerary-expand-icon"
        }
      />
    </li>
  );
};

export default Itinerary;
