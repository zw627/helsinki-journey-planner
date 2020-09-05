"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

// Set up Express
const port = 5000;
const app = express();

// Use parser (for request body)
app.use(bodyParser.json());

// Use routes
app.use("/api", routes);

// Handle error 404
app.use((req, res, next) => {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

// Handle other errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    Error: { message: err.message },
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
