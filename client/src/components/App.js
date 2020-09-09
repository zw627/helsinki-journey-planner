import React from "react";

import SearchProvider from "./context/SearchContext";
import SearchFrom from "./SearchForm";
import Itineraries from "./Itineraries";
import Notification from "./Notification";
import "./App.css";

const App = () => (
  <div className="app">
    <SearchProvider>
      <Notification />
      <SearchFrom />
      <Itineraries />
    </SearchProvider>
  </div>
);

export default App;
