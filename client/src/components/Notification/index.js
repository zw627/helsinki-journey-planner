import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ErrorOutlineRoundedIcon from "@material-ui/icons/ErrorOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";

import { SearchConsumer } from "../context/SearchContext";
import "./index.css";

const Notification = (props) => {
  const [slideOut, setSlideOut] = useState(false);

  const slideOutTimer = useRef(0);
  const unmountTimer = useRef(0);

  function clearTimers() {
    clearTimeout(slideOutTimer.current);
    clearTimeout(unmountTimer.current);
  }

  function handleNotificationClose() {
    // Execute slide-out animation and clear previous timers
    setSlideOut(true);
    clearTimers();
    // After animation is finished, unmount this component
    setTimeout(() => {
      props.setNotification(false, "");
    }, 600);
  }

  useEffect(() => {
    if (props.text) {
      // Start the slide out animation after 6s
      slideOutTimer.current = window.setTimeout(() => {
        setSlideOut(true);
      }, 6000);
      // After the animation (600) is finished, unmount this component
      unmountTimer.current = window.setTimeout(() => {
        props.setNotification(false, "");
      }, 6600);
    }
    return () => {
      clearTimers();
    };
  }, [props]);

  // JSX elements
  let iconElement = <span></span>;
  if (!props.isPositive) {
    iconElement = <ErrorOutlineRoundedIcon />;
  } else {
    iconElement = <CheckCircleOutlineRoundedIcon />;
  }

  return (
    <div
      className={slideOut ? "notification slide-out" : "notification slide-in"}
      onClick={handleNotificationClose}
    >
      {iconElement}
      <span>{props.text}</span>
    </div>
  );
};

Notification.propTypes = {
  isPositive: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  setNotification: PropTypes.func.isRequired,
};

const NotificationWrapper = () => {
  return (
    <SearchConsumer>
      {({ notification, actions }) =>
        notification["text"] ? (
          <Notification
            isPositive={notification["isPositive"]}
            text={notification["text"]}
            setNotification={actions.setNotification}
          />
        ) : null
      }
    </SearchConsumer>
  );
};

export default NotificationWrapper;
