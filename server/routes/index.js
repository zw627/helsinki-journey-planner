"use strict";

const express = require("express");
const addressLookup = require("./addressLookup/");
const addressSearch = require("./addressSearch/");
const itineraryPlanning = require("./itineraryPlanning/");

const router = express.Router();

// "/api"
router
  .get("/", (req, res) => {
    res.send("");
  })
  .use("/address-lookup", addressLookup)
  .use("/address-search", addressSearch)
  .use("/itinerary-planning", itineraryPlanning);

module.exports = router;
