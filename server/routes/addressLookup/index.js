"use strict";

const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// Input coordinates, get address
// https://digitransit.fi/en/developers/apis/2-geocoding-api/address-lookup/
router.post("/", async (req, res, next) => {
  try {
    // Import helpers
    const simplifyResJson = require("./helpers").simplifyResJson;

    // Fetch if all params are valid
    if (req.body.lat && req.body.lon) {

      // Fetch addresses
      const data = await fetch(
        `http://api.digitransit.fi/geocoding/v1/reverse?point.lat=${req.body.lat}&point.lon=${req.body.lon}&lang=en&size=1&layers=address`
      );
      const json = await data.json();

      // Send the simplified JSON (if valid)
      if (json["features"].length > 0) {
        res.json(simplifyResJson(json, true));
      } else {
        res.status(404).json({ message: "No address is found." });
      }
    }

    // Do nothing if one param is missing
    else {
      res.status(400).json({
        message: "One or more parameters are missing.",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
