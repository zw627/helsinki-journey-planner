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
      // Import helpers
      const setupQuery = require("./helpers").setupQuery;
      const simplifyResJson = require("./helpers").simplifyResJson;

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
        res.status(404).json({ message: "No route is found." });
      }
    }

    // Do nothing if one param is missing
    else {
      res.status(400).json({
        message:
          "One or more parameters missing. Or identical origin and destination.",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
