import React from "react";

import { SearchConsumer } from "../../context/SearchContext";
import "./style.css";

const SearchButton = () => {
  // e.g. 2020-09-04
  const getFormattedDate = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    return `${year}-${month}-${day}`;
  };

  // e.g. 11:51:02
  const getFormattedTime = () => {
    const sec = new Date().getSeconds();
    const min = new Date().getMinutes();
    const hour = new Date().getHours();
    return `${hour}:${min}:${sec}`;
  };

  return (
    <SearchConsumer>
      {({ actions }) => {
        const handleOnClick = (e) => {
          e.preventDefault();
          actions.setDate(getFormattedDate());
          actions.setTime(getFormattedTime());
          actions.getItineraries();
        };

        return (
          <button type="submit" onClick={handleOnClick}>
            Search
          </button>
        );
      }}
    </SearchConsumer>
  );
};

export default SearchButton;
