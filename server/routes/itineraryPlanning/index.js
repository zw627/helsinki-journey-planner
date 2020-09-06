"use strict";

const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

// "/api/itinerary-planning"
// Input two locations (coordinates), get routes
// https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
router.post("/", async (req, res, next) => {
  try {
    // Fetch if all params are valid
    if (
      req.body.origin.lat &&
      req.body.origin.lon &&
      req.body.destination.lat &&
      req.body.destination.lon &&
      req.body.date &&
      req.body.time
    ) {
      // Import helpers
      const setupQuery = require("./helpers").setupQuery;
      const simplifyResJson = require("./helpers").simplifyResJson;

      // Setup query (GraphQL)
      const query = setupQuery(req.body);

      // Fetch
      const data = await fetch(
        "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
        {
          method: "POST",
          body: JSON.stringify(query),
          headers: { "Content-Type": "application/json" },
        }
      );

      // Convert to JSON
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
        message: "One or more parameters are missing.",
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
