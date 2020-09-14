import React from "react";
import { withRouter } from "react-router-dom";

import {
  useSearchDispatch,
  useSearchState,
} from "../../context/SearchContext/";
import {
  fetchItineraries,
  dispatchSetDateTime,
  dispatchSetExtractedDateTime,
} from "../../context/SearchContext/helpers";
import useQueryString from "../../hooks/useQuery";
import {
  getCurrentDay,
  getCurrentHours,
  getCurrentMinutes,
  getCurrentMonth,
  getLastDay,
  hasInvalidValue,
} from "../../../utils";
import "./index.css";

const SetTimeForm = ({ history }) => {
  // Context
  const dispatch = useSearchDispatch();
  const state = useSearchState();

  // Local
  const [isInitializing, setInitializing] = React.useState(true);
  const [queryObject] = React.useState(useQueryString(isInitializing));

  // Max 2 characters, num only
  function filter(string) {
    return string.replace(/[^0-9]/g, "").substring(0, 2);
  }

  // Max 23, num only
  function handleHours(e) {
    let filtered = filter(e.target.value);
    if (filtered > 23) filtered = 23;
    dispatch({
      type: "setTime",
      payload: { ...state.time, hours: filtered },
    });
  }

  // Max 59, num only
  function handleMinutes(e) {
    let filtered = filter(e.target.value);
    if (filtered > 59) filtered = 59;
    dispatch({
      type: "setTime",
      payload: { ...state.time, minutes: filtered },
    });
  }

  // Max last day, num only
  function handleDay(e) {
    const lastDay = getLastDay(state.month);
    let filtered = filter(e.target.value);
    if (filtered > lastDay) filtered = lastDay;
    dispatch({
      type: "setDate",
      payload: { ...state.date, day: filtered },
    });
  }

  // Max 12, num only
  function handleMonth(e) {
    let filtered = filter(e.target.value);
    if (filtered > 12) filtered = 12;
    dispatch({
      type: "setDate",
      payload: { ...state.date, month: filtered },
    });
  }

  function setAndFetch(month, day, hours, minutes) {
    // Fetch new itineraries
    const year = new Date().getFullYear();
    const combinedDate = `${year}-${month}-${day}`;
    const combinedTime = `${hours}:${minutes}`;
    fetchItineraries(state, dispatch, history, {
      origin: state.origin,
      destination: state.destination,
      combinedDate,
      combinedTime,
    });
    dispatchSetDateTime(dispatch, {
      month,
      day,
      hours,
      minutes,
    });
    dispatch({
      type: "setNotification",
      payload: { isPositive: false, text: "" },
    });
    // Unmount if origin and destination inputs are somehow empty
    if (!state.origin.name || !state.destination.name) {
      dispatch({ type: "setItineraries", payload: [] });
    }
  }

  function handleSet(e) {
    e.preventDefault();
    setAndFetch(
      state.date.month,
      state.date.day,
      state.time.hours,
      state.time.minutes
    );
  }

  function handleNow(e) {
    e.preventDefault();
    setAndFetch(
      getCurrentMonth(),
      getCurrentDay(),
      getCurrentHours(),
      getCurrentMinutes()
    );
  }

  // Fetch data based the URL params if available
  React.useEffect(() => {
    if (!hasInvalidValue(queryObject) && isInitializing) {
      dispatchSetExtractedDateTime(dispatch, {
        date: queryObject.date,
        time: queryObject.time,
      });
      setInitializing(false);
    }
  }, [queryObject, isInitializing, dispatch]);

  return (
    <form className="itineraries-form">
      <div className="itineraries-form-inputs-container">
        <div className="itineraries-time-input-container">
          <input
            type="text"
            pattern="[0-9]*"
            value={state.time.hours}
            onChange={handleHours}
            maxLength="2"
          />
          <span>:</span>
          <input
            type="text"
            pattern="[0-9]*"
            value={state.time.minutes}
            onChange={handleMinutes}
            maxLength="2"
          />
        </div>

        <div className="itineraries-date-input-container">
          <input
            type="text"
            pattern="[0-9]*"
            value={state.date.day}
            onChange={handleDay}
            maxLength="2"
          />
          <span>/</span>
          <input
            type="text"
            pattern="[0-9]*"
            value={state.date.month}
            onChange={handleMonth}
            maxLength="2"
          />
        </div>
      </div>

      <div className="itineraries-form-buttons">
        <button type="submit" onClick={handleSet} onTouchEnd={() => {}}>
          Set
        </button>
        <button type="submit" onClick={handleNow} onTouchEnd={() => {}}>
          Now
        </button>
      </div>
    </form>
  );
};

export default withRouter(SetTimeForm);
