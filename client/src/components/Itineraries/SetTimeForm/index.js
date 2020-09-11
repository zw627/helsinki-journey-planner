import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import useQueryString from "../../hooks/useQuery";
import { pad, getLastDay, hasInvalidValue } from "../../../utils";
import "./index.css";

const SetTimeForm = ({
  origin,
  destination,
  setNotification,
  setItineraries,
  fetchItineraries,
}) => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [isInitializing, setInitializing] = useState(true);
  const [queryObject] = useState(useQueryString(isInitializing));

  // Max 2 characters, num only
  function filter(string) {
    return string.replace(/[^0-9]/g, "").substring(0, 2);
  }

  // Max 23, num only
  function handleHours(e) {
    let filtered = filter(e.target.value);
    if (filtered > 23) filtered = 23;
    setHours(filtered);
  }

  // Max 59, num only
  function handleMinutes(e) {
    let filtered = filter(e.target.value);
    if (filtered > 59) filtered = 59;
    setMinutes(filtered);
  }

  // Max last day, num only
  function handleDay(e) {
    const lastDay = getLastDay(month);
    let filtered = filter(e.target.value);
    if (filtered > lastDay) filtered = lastDay;
    setDay(filtered);
  }

  // Max 12, num only
  function handleMonth(e) {
    let filtered = filter(e.target.value);
    if (filtered > 12) filtered = 12;
    setMonth(filtered);
  }

  function handleSetTime(month, day, hours, minutes) {
    setHours(pad(hours));
    setMinutes(pad(minutes));
    setMonth(pad(month));
    setDay(pad(day));
    // Fetch new itineraries
    const year = new Date().getFullYear();
    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}`;
    fetchItineraries(origin, destination, date, time);
    setNotification({ isPositive: false, text: "" });
    // Unmount if origin and destination inputs are somehow empty
    if (!origin["name"] || !destination["name"]) {
      setItineraries([]);
    }
  }

  function handleSet(e) {
    e.preventDefault();
    handleSetTime(month, day, hours, minutes);
  }

  function handleNow(e) {
    e.preventDefault();
    const currentDate = new Date();
    const hours = pad(currentDate.getHours());
    const minutes = pad(currentDate.getMinutes());
    const day = pad(currentDate.getDate());
    const month = pad(currentDate.getMonth() + 1);
    handleSetTime(month, day, hours, minutes);
  }

  // Fetch data based the URL params if available
  useEffect(() => {
    if (!hasInvalidValue(queryObject) && isInitializing) {
      const queryTime = queryObject["time"].split(":");
      const queryDate = queryObject["date"].split("-");
      setHours(pad(queryTime[0]));
      setMinutes(pad(queryTime[1]));
      setDay(pad(queryDate[2]));
      setMonth(pad(queryDate[1]));
      setInitializing(false);
    }
  }, [queryObject, isInitializing]);

  return (
    <form className="itineraries-form">
      <div className="itineraries-form-inputs">
        <div className="itineraries-time-input">
          <input
            type="text"
            value={hours}
            onChange={handleHours}
            maxLength="2"
          />
          <span>:</span>
          <input
            type="text"
            value={minutes}
            onChange={handleMinutes}
            maxLength="2"
          />
        </div>

        <div className="itineraries-date-input">
          <input type="text" value={day} onChange={handleDay} maxLength="2" />
          <span>.</span>
          <input
            type="text"
            value={month}
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

SetTimeForm.propTypes = {
  origin: PropTypes.object.isRequired,
  destination: PropTypes.object.isRequired,
  setNotification: PropTypes.func.isRequired,
  setItineraries: PropTypes.func.isRequired,
  fetchItineraries: PropTypes.func.isRequired,
};

export default SetTimeForm;
