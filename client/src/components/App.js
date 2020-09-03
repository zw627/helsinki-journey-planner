import React, { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((res) => {
        setData(res.text);
      });
  }, []);

  return (
    <div className="App">
      <p>Greetings from {data}.</p>
    </div>
  );
};

export default App;
