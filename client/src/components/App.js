import React from "react";

import SearchFrom from "./SearchForm";
import Iteneraries from "./Iteneraries";
import SearchProvider from "./context/SearchContext";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <SearchProvider>
        <SearchFrom />
        <Iteneraries />
      </SearchProvider>
    </div>
  );
};

export default App;
