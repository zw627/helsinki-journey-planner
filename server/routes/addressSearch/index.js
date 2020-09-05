"use strict";

const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// Input text, get addresses
// https://digitransit.fi/en/developers/apis/2-geocoding-api/address-search/
router.post("/", async (req, res, next) => {
  try {
    // Fetch if input has more than 2 characters
    if (req.body.text.length > 1) {
      // Import helpers
      const setupQuery = require("./helpers").setupQuery;
      const simplifyResJson = require("./helpers").simplifyResJson;

      // Setup query (query string)
      const query = setupQuery(req.body);

      // Fetch
      const data = await fetch(
        `http://api.digitransit.fi/geocoding/v1/search?${query}`
      );

      // Convert to JSON
      const json = await data.json();

      // Send the simplified JSON (if valid)
      if (json["features"].length > 0) {
        res.json(simplifyResJson(json, true));
      } else {
        res.status(404).json({ message: "No address is found." });
      }
    }

    // Do nothing if input has less than 2 characters
    else {
      res.status(400).json({ message: "Minimal number of characters: 2" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
