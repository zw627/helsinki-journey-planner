"use strict";

const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// "/api/address-lookup"
// Input coordinates, get address
// https://digitransit.fi/en/developers/apis/2-geocoding-api/address-lookup/
router.post("/", async (req, res, next) => {
  try {
    // Lazy load helpers
    const { simplifyResJson } = require("./helpers");

    // Fetch if all params are valid
    if (req.body.lat && req.body.lon) {
      // Fetch addresses
      const data = await fetch(
        `https://api.digitransit.fi/geocoding/v1/reverse?point.lat=${req.body.lat}&point.lon=${req.body.lon}&lang=en&size=1&layers=address`
      );
      const json = await data.json();

      // Send the simplified JSON (if valid)
      if (json["features"].length > 0) {
        res.json(simplifyResJson(json, true));
      } else {
        res.status(404).json({ message: "No results found." });
      }
    }

    // Do nothing if one param is missing
    else {
      res.status(400).json({
        message: "Invalid coordinates.",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
