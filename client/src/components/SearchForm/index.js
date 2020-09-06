import React from "react";

import SearchFormProvider, {
  SearchFormConsumer,
} from "../context/SearchFormContext";
import DestinationInput from "./DestinationInput";
import OriginInput from "./OriginInput";
import "./style.css";

const SearchForm = () => {
  return (
    <SearchFormProvider>
      <form className="search-form-container">
        <div className="search-form-header-overlay"></div>
        <header>
          <h1>Helsinki</h1>
          <p>Journey Planner</p>
        </header>
        <div className="search-form-main-container">
          <div className="search-form-inputs-container">
            <OriginInput />
            <DestinationInput />
          </div>
          <div className="search-form-submit-container">
            <SearchFormConsumer>
              {({ actions }) => (
                <button type="submit" onClick={actions.getItineraries}>
                  Search
                </button>
              )}
            </SearchFormConsumer>
          </div>
        </div>
      </form>
    </SearchFormProvider>
  );
};

export default SearchForm;
