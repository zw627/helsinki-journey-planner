import React from "react";
import { withRouter } from "react-router-dom";

import {
  useSearchDispatch,
  useSearchState,
} from "../../context/SearchContext/";
import {
  fetchItineraries,
  dispatchSetCurrentDateTime,
} from "../../context/SearchContext/helpers";
import { getCurrentDate, getCurrentTime } from "../../../utils/index";
import "./index.css";

const SearchButton = ({ history }) => {
  const state = useSearchState();
  const dispatch = useSearchDispatch();

  function handleOnClick(e) {
    e.preventDefault();
    fetchItineraries(state, dispatch, history, {
      origin: state.origin,
      destination: state.destination,
      date: getCurrentDate(),
      time: getCurrentTime(),
    });
    dispatchSetCurrentDateTime(dispatch);
  }

  return (
    <button type="submit" onClick={handleOnClick}>
      Search
    </button>
  );
};

export default withRouter(SearchButton);
