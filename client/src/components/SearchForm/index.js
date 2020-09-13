import React from "react";

import SearchBar from "./SearchBar";
import SwapButton from "./SwapButton";
import SearchButton from "./SearchButton";
import "./index.css";

const SearchForm = () => (
  <form className="search-form-container">
    <div className="search-form-header-overlay"></div>
    <header>
      <h1>Helsinki</h1>
      <p>Journey Planner</p>
    </header>
    <div className="search-form-main-container">
      <div className="search-bars-container">
        <SearchBar isOrigin={true} />
        <SwapButton />
        <SearchBar isOrigin={false} />
      </div>
      <div className="search-submit-container">
        <SearchButton />
      </div>
    </div>
  </form>
);

export default SearchForm;
