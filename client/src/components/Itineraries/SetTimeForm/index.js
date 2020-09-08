import React, { useState, useEffect } from "react";

import "./index.css";
import { pad, getFormattedDate } from "../../../utils";

const SetTimeForm = (props) => {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [date, setDate] = useState("");

  const handleHours = (e) => {
    // Only numbers allowed, max 2 characters, max 23
    let filtered = e.target.value.replace(/[^0-9]/g, "").substring(0, 2);
    if (filtered > 23) filtered = 23;
    setHours(filtered);
  };

  const handleMinutes = (e) => {
    // Only numbers allowed, max 2 characters, max 59
    let filtered = e.target.value.replace(/[^0-9]/g, "").substring(0, 2);
    if (filtered > 59) filtered = 59;
    setMinutes(filtered);
  };

  const handleSetTime = (e) => {
    e.preventDefault();
    const time = `${hours}:${minutes}`;
    props.handleSetItineraries(
      props.origin,
      props.destination,
      getFormattedDate(),
      time
    );
  };

  useEffect(() => {
    // Set current time after users clicked search (this component is rendered)
    setHours(pad(new Date().getHours()));
    setMinutes(pad(new Date().getMinutes()));
  }, []);

  return (
    <form className="itineraries-form">
      <div className="itineraries-house-minutes-input">
        <input type="text" value={hours} onChange={handleHours} maxLength="2" />
        <span>:</span>
        <input
          type="text"
          value={minutes}
          onChange={handleMinutes}
          maxLength="2"
        />
      </div>
      <button type="submit" onClick={handleSetTime} onTouchEnd={() => {}}>
        Set Time
      </button>
    </form>
  );
};

export default SetTimeForm;
