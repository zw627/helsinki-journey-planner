"use strict";

const express = require("express");
const addressSearch = require("./addressSearch/");
const itineraryPlanning = require("./itineraryPlanning/");

const router = express.Router();

router
  .get("/", (req, res) => {
    res.json({ text: "Hello from the server!" });
  })
  .use("/address-search", addressSearch)
  .use("/itinerary-planning", itineraryPlanning);

module.exports = router;
