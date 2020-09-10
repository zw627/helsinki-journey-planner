"use strict";

const express = require("express");
const fetch = require("node-fetch");
const { setupQuery, simplifyResJson } = require("./helpers");

const router = express.Router();

// "/api/address-search"
// Input text, get addresses and public transport stations
// https://digitransit.fi/en/developers/apis/2-geocoding-api/address-search/
router.post("/", async (req, res, next) => {
  try {
    // Fetch if input has more than 2 characters
    if (req.body.text.length > 2) {
      // Fetch addresses
      const query = setupQuery(req.body, "default");
      const data = await fetch(
        `https://api.digitransit.fi/geocoding/v1/search?${query}`
      );
      const json = await data.json();

      // Fetch public transport stations
      const queryTransport = setupQuery(req.body, "transport");
      const dataTransport = await fetch(
        `https://api.digitransit.fi/geocoding/v1/search?${queryTransport}`
      );
      const jsonTransport = await dataTransport.json();

      // Merge responses
      const jsonMerged = [...json["features"], ...jsonTransport["features"]];

      // Send the simplified JSON if valid
      if (jsonMerged.length > 0) {
        res.json(simplifyResJson(jsonMerged, true));
      } else {
        res.status(404).json({ message: "No results found." });
      }
    }

    // Do nothing if input has less than 2 characters
    else {
      res.status(400).json({ message: "Minimal two characters." });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
