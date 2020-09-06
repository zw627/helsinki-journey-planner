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
                <input
                  type="submit"
                  value="Search"
                  onClick={actions.getItineraries}
                />
              )}
            </SearchFormConsumer>
          </div>
        </div>
      </form>
    </SearchFormProvider>
  );
};

export default SearchForm;
