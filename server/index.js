"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");

// Set up Express
const port = process.env.PORT || 5000;
const app = express();

// Use parser (for request body)
app.use(bodyParser.json());

// Use CORS if it is not development
let corsOptions;
if (!(app.get("env") === "development")) {
  const whitelist = ["https://helsinki-journey-planner.netlify.app"];
  corsOptions = {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Access denied, this origin is not allowed."));
      }
    },
  };
}

app.get("/", (req, res) => {
  res.send("");
});

// Use routes
app.use("/api", cors(corsOptions), routes);

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
