"use strict";

const express = require("express");

const app = express();
const port = 5000;
const routes = require("./routes");

app.use("/api", routes);

// 404 not found
app.use((req, res, next) => {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

// Error
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    Error: { message: err.message },
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
