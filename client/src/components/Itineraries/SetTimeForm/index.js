import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { pad, getLastDay } from "../../../utils";
import "./index.css";

const SetTimeForm = (props) => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // Only numbers allowed, max 2 characters
  function filter(string) {
    return string.replace(/[^0-9]/g, "").substring(0, 2);
  }

  function handleHours(e) {
    let filtered = filter(e.target.value);
    if (filtered > 23) filtered = 23;
    setHours(filtered);
  }

  function handleMinutes(e) {
    let filtered = filter(e.target.value);
    if (filtered > 59) filtered = 59;
    setMinutes(filtered);
  }

  function handleDay(e) {
    const lastDay = getLastDay(month);

    let filtered = filter(e.target.value);
    if (filtered > lastDay) filtered = lastDay;
    setDay(filtered);
  }

  function handleMonth(e) {
    let filtered = filter(e.target.value);
    if (filtered > 12) filtered = 12;
    setMonth(filtered);
  }

  function handleSetTime(e) {
    e.preventDefault();

    // For visual purpose, 1:3 => 01:03
    setHours(pad(hours));
    setMinutes(pad(minutes));
    setMonth(pad(month));
    setDay(pad(day));

    // Fetch new itineraries
    const year = new Date().getFullYear();
    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}`;
    props.handleSetItineraries(props.origin, props.destination, date, time);

    // Unmount if origin and destination inputs are somehow empty
    if (!props.origin["name"] || !props.destination["name"]) {
      props.setItineraries([]);
    }
  }

  useEffect(() => {
    // Set current time after users clicked search (this component is rendered)
    const currentDate = new Date();
    setHours(pad(currentDate.getHours()));
    setMinutes(pad(currentDate.getMinutes()));
    setDay(pad(currentDate.getDate()));
    setMonth(pad(currentDate.getMonth() + 1));
  }, []);

  return (
    <form className="itineraries-form">
      <div className="itineraries-time-input">
        <input type="text" value={hours} onChange={handleHours} maxLength="2" />
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
        <input type="text" value={month} onChange={handleMonth} maxLength="2" />
      </div>
      <button type="submit" onClick={handleSetTime} onTouchEnd={() => {}}>
        Set Time
      </button>
    </form>
  );
};

SetTimeForm.propTypes = {
  origin: PropTypes.object.isRequired,
  destination: PropTypes.object.isRequired,
  setItineraries: PropTypes.func.isRequired,
  handleSetItineraries: PropTypes.func.isRequired,
};

export default SetTimeForm;
