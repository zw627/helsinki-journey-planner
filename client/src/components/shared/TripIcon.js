import React from "react";
import PropTypes from "prop-types";

import FlightRoundedIcon from "@material-ui/icons/FlightRounded";
import DirectionsBikeRoundedIcon from "@material-ui/icons/DirectionsBikeRounded";
import DirectionsBusRoundedIcon from "@material-ui/icons/DirectionsBusRounded";
import DirectionsCarRoundedIcon from "@material-ui/icons/DirectionsCarRounded";
import DirectionsBoatRoundedIcon from "@material-ui/icons/DirectionsBoatRounded";
import TrainRoundedIcon from "@material-ui/icons/TrainRounded";
import DirectionsSubwayRoundedIcon from "@material-ui/icons/DirectionsSubwayRounded";
import TramRoundedIcon from "@material-ui/icons/TramRounded";
import DirectionsWalkRoundedIcon from "@material-ui/icons/DirectionsWalkRounded";

const TripIcon = (props) => {
  const getIcon = (text, className) => {
    switch (text) {
      case "AIRPLANE":
        return <FlightRoundedIcon className={className} />;
      case "BICYCLE":
        return <DirectionsBikeRoundedIcon className={className} />;
      case "BUS":
        return <DirectionsBusRoundedIcon className={className} />;
      case "CABLE_CAR":
        return <DirectionsBusRoundedIcon className={className} />;
      case "CAR":
        return <DirectionsCarRoundedIcon className={className} />;
      case "FERRY":
        return <DirectionsBoatRoundedIcon className={className} />;
      case "FUNICULAR":
        return <TramRoundedIcon className={className} />;
      case "GONDOLA":
        return <DirectionsBoatRoundedIcon className={className} />;
      case "RAIL":
        return <TrainRoundedIcon className={className} />;
      case "SUBWAY":
        return <DirectionsSubwayRoundedIcon className={className} />;
      case "TRAM":
        return <TramRoundedIcon className={className} />;
      case "WALK":
        return <DirectionsWalkRoundedIcon className={className} />;
      default:
        return null;
    }
  };

  return (
    <React.Fragment>{getIcon(props.text, props.className)}</React.Fragment>
  );
};

TripIcon.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default TripIcon;
