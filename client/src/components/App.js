import React from "react";
import { BrowserRouter } from "react-router-dom";

import { SearchProvider } from "./context/SearchContext/";
import SearchFrom from "./SearchForm";
import Itineraries from "./Itineraries";
import Notification from "./Notification";
import "./App.css";

const App = () => (
  <div className="app">
    <BrowserRouter>
      <SearchProvider>
        <Notification />
        <SearchFrom />
        <Itineraries />
      </SearchProvider>
    </BrowserRouter>
  </div>
);

export default App;
