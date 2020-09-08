import React from "react";

import SearchFrom from "./SearchForm";
import Itineraries from "./Itineraries";
import SearchProvider from "./context/SearchContext";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <SearchProvider>
        <SearchFrom />
        <Itineraries />
      </SearchProvider>
    </div>
  );
};

export default App;
