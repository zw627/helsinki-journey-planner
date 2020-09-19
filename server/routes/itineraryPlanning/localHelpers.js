// Digitransit GraphQL API
// URL: https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql
// Docs: https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/

module.exports = {
  /**
   * Set up the JSON equivalent of GraphQL query for Digitransit GraphQL API (itinerary planning).
   * https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
   * @param {object} body - The JSON body of the HTTP request.
   * @returns {object} The JSON equivalent of GraphQL query for Digitransit  GraphQL API (itinerary planning).
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
   * @param {object} json - The response JSON object from the API.
   * @param {boolean} simplify - True to simplify the object, false returns the original object.
   * @returns {object} The simplified JSON object from Digitransit GraphQL API (itinerary planning).
   */
  simplifyResJson: function (json, simplify) {
    // Lazy load helpers
    const { zeroToOne } = require("../../utils");

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

        // Zones, e.g. AB, ABC, ABCD, BC, BCD, CD, D
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

          zones.sort();

          if (zones.length > 0) {
            // Zone A only => AB => 2.8
            // Zone B only => AB / BC => 2.8
            if (zones.length === 1 && (zones[0] === "A" || zones[0] === "B")) {
              zones = ["A", "B"];
            }

            // Zone C only => BC (2.8) / CD (3.2)
            else if (zones.length === 1 && zones[0] === "C") {
              zones = ["B", "C"];
            }

            // AC => ABC
            else if (
              zones.length === 2 &&
              zones[0] === "A" &&
              zones[1] === "C"
            ) {
              zones = ["A", "B", "C"];
            }

            // AD => ABCD
            else if (
              zones.length === 2 &&
              zones[0] === "A" &&
              zones[1] === "D"
            ) {
              zones = ["A", "B", "C", "D"];
            }

            // BD => BCD
            else if (
              zones.length === 2 &&
              zones[0] === "B" &&
              zones[1] === "D"
            ) {
              zones = ["B", "C", "D"];
            }

            // AB, ABC, ABCD, BC, BCD, CD, D
            else {
              zones.sort();
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
