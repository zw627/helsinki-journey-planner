"use strict";

const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");

// Set up Express
const app = express();
const port = process.env.PORT || 5000;

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

// File rate limiter: max 5 requests per min
const fileLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 5, // limit each IP to x requests per windowMs
});

// API rate limiter: max 100 per 15 min
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.static(path.join(__dirname, "/../client/build")));

// Serve the React app at site.com/
app.get("/", fileLimiter, (req, res) => {
  res.sendFile(path.join(__dirname, "/../client/build/index.html"));
});

// The API routes at site.com/api/
app.use("/api", apiLimiter, cors(corsOptions), routes);

// Handle error 404
app.use((req, res, next) => {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

// Handle other errors
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    Error: { message: err.message },
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
