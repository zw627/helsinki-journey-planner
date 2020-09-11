"use strict";

const express = require("express");
const fetch = require("node-fetch");
const { setupQuery, simplifyResJson } = require("./localHelpers");
const { hasInvalidValue } = require("../../utils");

const router = express.Router();

// "/api/itinerary-planning"
// Input two locations (coordinates), get routes
// https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
router.post("/", async (req, res, next) => {
  try {
    const origin = req.body.origin;
    const destination = req.body.destination;
    const date = req.body.date;
    const time = req.body.time;

    const allParametersAreValid =
      !hasInvalidValue(origin) && !hasInvalidValue(destination) && date && time;

    const twoLocationsAreNotIdentical =
      origin["coordinates"]["lat"] !== destination["coordinates"]["lat"] &&
      origin["coordinates"]["lon"] !== destination["coordinates"]["lon"];

    // Fetch if all params are valid
    if (allParametersAreValid && twoLocationsAreNotIdentical) {
      // Fetch itineraries
      const query = setupQuery(req.body);
      const data = await fetch(
        "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
        {
          method: "POST",
          body: JSON.stringify(query),
          headers: { "Content-Type": "application/json" },
        }
      );
      const json = await data.json();

      // Send the simplified JSON (if valid)
      if (json["data"]["plan"]["itineraries"].length > 0) {
        res.json(simplifyResJson(json, true));
      } else {
        res.status(404).json({ message: "No results found." });
      }
    }

    // Do nothing if one param is missing
    else {
      res.status(400).json({
        message: "Addresses identical and invalid.",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
