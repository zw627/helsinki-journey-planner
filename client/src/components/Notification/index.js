import React, { useState, useEffect, useRef } from "react";
import ErrorOutlineRoundedIcon from "@material-ui/icons/ErrorOutlineRounded";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";

import { useSearchDispatch, useSearchState } from "../context/SearchContext/";
import "./index.css";

const Notification = () => {
  // Context
  const state = useSearchState();
  const dispatch = useSearchDispatch();

  // Local
  const [slideOut, setSlideOut] = useState(false);
  const slideOutTimer = useRef(0);
  const unmountTimer = useRef(0);

  function clearTimers() {
    clearTimeout(slideOutTimer.current);
    clearTimeout(unmountTimer.current);
  }

  function closeNotification() {
    // Start slide-out animation, clear timeout
    setSlideOut(true);
    clearTimers();
    // After the animation (600) is finished, empty text to unmount this component
    setTimeout(() => {
      dispatch({
        type: "setNotification",
        payload: { isPositive: false, text: "" },
      });
    }, 600);
  }

  useEffect(() => {
    if (state.notification.text) {
      // Start the slide out animation after 6s
      slideOutTimer.current = window.setTimeout(() => {
        setSlideOut(true);
      }, 6000);
      // After the animation (600) is finished, empty text to unmount this component
      unmountTimer.current = window.setTimeout(() => {
        dispatch({
          type: "setNotification",
          payload: { isPositive: false, text: "" },
        });
      }, 6600);
    }
    return () => {
      clearTimers();
    };
  }, [state, dispatch]);

  // JSX elements
  let iconElement = <span></span>;
  if (!state.notification.isPositive) {
    iconElement = <ErrorOutlineRoundedIcon />;
  } else {
    iconElement = <CheckCircleOutlineRoundedIcon />;
  }

  return (
    <>
      {state.notification.text ? (
        <div
          className={
            slideOut ? "notification slide-out" : "notification slide-in"
          }
          onClick={closeNotification}
        >
          {iconElement}
          <span>{state.notification.text}</span>
        </div>
      ) : null}
    </>
  );
};

export default Notification;
