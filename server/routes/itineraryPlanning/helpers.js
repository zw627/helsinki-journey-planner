// Digitransit GraphQL API
// URL: https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql
// Docs: https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/

module.exports = {
  /**
   * Set up the JSON equivalent of GraphQL query for Digitransit GraphQL API (itinerary planning).
   * https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
   * @param {Object} body - The JSON body of the HTTP request.
   * @returns {Object} The JSON equivalent of GraphQL query for Digitransit  GraphQL API (itinerary planning).
   */
  setupQuery: function (body) {
    // https://digitransit.fi/en/developers/apis/1-routing-api/0-graphql/
    return {
      query: `{
                plan(
                  from: {lat: ${body.origin["coordinates"]["lat"]}, lon: ${body.origin["coordinates"]["lon"]}},
                  to: {lat: ${body.destination["coordinates"]["lat"]}, lon: ${body.destination["coordinates"]["lon"]}},
                  numItineraries: 5,
                  date: "${body.date}",
                  time: "${body.time}",
                ) {
                  itineraries {
                    duration
                    walkDistance
                    startTime
                    endTime
                    fares {
                      type
                      cents
                      currency
                    }
                    legs {
                      mode
                      startTime
                      endTime
                      duration
                      distance
                      trip {
                        tripHeadsign
                        routeShortName
                      }
                      from {
                        lat
                        lon
                        name
                        stop {
                          code
                          name
                          zoneId
                        }
                      }
                      to {
                        lat
                        lon
                        name
                        stop {
                          code
                          name
                          zoneId
                        }
                      }
                    }
                  }
                }
              }`,
    };
  },

  /**
   * Simplify the response JSON object from Digitransit GraphQL API (itinerary planning).
   * https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
   * @param {Object} json - The response JSON object from the API.
   * @param {boolean} simplify - True to simplify the object, false returns the original object.
   * @returns {Object} The simplified JSON object from Digitransit GraphQL API (itinerary planning).
   */
  simplifyResJson: function (json, simplify) {
    // Lazy load helpers
    const { zeroToOne } = require("../../utils");
    const { getPreviousLettersInAlphabet } = require("../../utils");

    if (simplify) {
      return json["data"]["plan"]["itineraries"].map((itinerary) => {
        // A summary of all trips invovled (walk, bus, tram)
        const tripsSummary = itinerary["legs"].map((leg) => ({
          id: require("uuid").v4(),
          mode: leg["mode"], // e.g. WALK, TRAM
          startTime: leg["startTime"],
          trip: leg["trip"], // e.g. M1 Matinkylä, null
          stop: leg["from"]["stop"],
        }));

        // The first public transport trip in the list
        const firstPublicTransportTrip = tripsSummary.find(
          (trip) => trip["mode"] !== "WALK"
        );

        // Zones, e.g. ABC
        const getZones = () => {
          let zones = [];

          // Add to zones if it's not already included
          tripsSummary.map((tripSummary) => {
            const tripStop = tripSummary["stop"];
            if (tripStop) {
              const zoneId = tripStop["zoneId"];
              const notIncluded = !zones.find((zone) => zone === zoneId);
              if (notIncluded) zones = [...zones, zoneId];
            }
          });

          if (zones.length > 0) {
            // Zone A is always tied to zone B
            if (zones.length === 1 && zones[0] === "A") {
              zones = [...zones, "B"].sort();
            }

            // Add previous zones if missing, e.g. D should be ABCD
            else {
              zones.sort();
              const lastLetter = zones[zones.length - 1];
              zones = [...getPreviousLettersInAlphabet(lastLetter), lastLetter];
            }
          }

          return zones;
        };

        const getFaresSum = () => {
          const fares = itinerary["fares"];

          if (fares)
            return fares.reduce(
              (accumulator, currentValue) =>
                (accumulator += currentValue["cents"]),
              0
            );
        };

        return {
          // Generate ID
          id: require("uuid").v4(),

          // Total duration in minutes
          duration: zeroToOne(Math.floor(itinerary["duration"] / 60)),

          // Walk distance in meters
          walkDistance: zeroToOne(Math.floor(itinerary["walkDistance"])),

          startTime: itinerary["startTime"],
          endTime: itinerary["endTime"],
          fares: itinerary["fares"],
          faresSum: getFaresSum(),
          zones: getZones(),

          // The first public transport you need to catch
          firstPublicTransportTrip,

          // A summary of all trips invovled (walk, bus, tram)
          tripsSummary,

          // All routes
          legs: itinerary["legs"].map((leg) => {
            return {
              id: require("uuid").v4(),
              mode: leg["mode"], // e.g. WALK, TRAM
              startTime: leg["startTime"],
              endTime: leg["endTime"],
              duration: zeroToOne(Math.floor(leg["duration"] / 60)), // Minutes
              distance: zeroToOne(Math.floor(leg["distance"])), // Meters
              trip: leg["trip"], // e.g. M1 Matinkylä, null
              from: {
                name: leg["from"]["name"],
                stop: leg["from"]["stop"],
              },
              to: {
                name: leg["to"]["name"],
                stop: leg["to"]["stop"],
              },
            };
          }),
        };
      });
    }
    return json;
  },
};
