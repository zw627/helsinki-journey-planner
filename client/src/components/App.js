import React, { useState, useEffect } from "react";
import axios from "axios";

import SearchFrom from "./SearchForm/";

const App = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    axios
      .get("/api")
      .then((res) => {
        setData(res.data.text);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      <p>Greetings from {data}.</p>
      <SearchFrom />
    </div>
  );
};

export default App;
