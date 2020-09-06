import React from "react";

import SearchBarDest from "./SearchBarDest";
import SearchBarOrigin from "./SearchBarOrigin";
import SearchButton from "./SearchButton";
import "./index.css";

const SearchForm = () => {
  return (
    <form className="search-form-container">
      <div className="search-form-header-overlay"></div>
      <header>
        <h1>Helsinki</h1>
        <p>Journey Planner</p>
      </header>
      <div className="search-form-main-container">
        <div className="search-bars-container">
          <SearchBarOrigin />
          <SearchBarDest />
        </div>
        <div className="search-submit-container">
          <SearchButton />
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
