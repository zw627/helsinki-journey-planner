import React from "react";
import { withRouter } from "react-router-dom";
import SwapVertRoundedIcon from "@material-ui/icons/SwapVertRounded";

import { useSearchDispatch, useSearchState } from "../../context/SearchContext";
import { fetchItineraries } from "../../context/SearchContext/helpers";
import { hasInvalidValue } from "../../../utils";
import "./index.css";

const SwapButton = ({ history }) => {
  const state = useSearchState();
  const dispatch = useSearchDispatch();

  function handleOnclick(e) {
    e.preventDefault();
    const { origin, destination, date, time } = state;

    // Swap if all params are valid
    if (
      !hasInvalidValue(origin) &&
      !hasInvalidValue(destination) &&
      date &&
      time
    ) {
      const year = new Date().getFullYear();
      const combinedDate = `${year}-${date.month}-${date.day}`;
      const combinedTime = `${time.hours}:${time.minutes}`;

      // Set
      fetchItineraries(state, dispatch, history, {
        origin: destination,
        destination: origin,
        combinedDate,
        combinedTime,
        saveDateTimeToQueries: true,
      });
      dispatch({ type: "setDestination", payload: origin });
      dispatch({ type: "setOrigin", payload: destination });
      document.getElementById("origin-input").value = destination.name;
      document.getElementById("destination-input").value = origin.name;
    }
  }

  return (
    <button
      type="button"
      className="swap-button"
      onClick={handleOnclick}
      onTouchEnd={() => {}}
    >
      <SwapVertRoundedIcon />
    </button>
  );
};

export default withRouter(SwapButton);
