"use strict";

const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// "/api/itinerary-planning"
// Input two locations (coordinates), get routes
// https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
router.post("/", async (req, res, next) => {
  try {
    const allParametersAreValid =
      req.body.origin["coordinates"]["lat"] &&
      req.body.origin["coordinates"]["lon"] &&
      req.body.destination["coordinates"]["lat"] &&
      req.body.destination["coordinates"]["lon"] &&
      req.body.date &&
      req.body.time;

    const twoLocationsAreNotIdentical =
      req.body.origin["coordinates"]["lat"] !==
        req.body.destination["coordinates"]["lat"] &&
      req.body.origin["coordinates"]["lon"] !==
        req.body.destination["coordinates"]["lon"];

    // Fetch if all params are valid
    if (allParametersAreValid && twoLocationsAreNotIdentical) {
      // Lazy load helpers
      const { setupQuery } = require("./helpers");
      const { simplifyResJson } = require("./helpers");

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
        message:
          "Identical origin and destination. Or invalid origin, destination, date, or time.",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
