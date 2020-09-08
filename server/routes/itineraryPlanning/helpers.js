// Digitransit GraphQL API
// URL: https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql
// Docs: https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/

const checkZero = require("../../utils").zeroToOne;

module.exports = {
  /**
   * Set up the JSON equivalent of GraphQL query for Digitransit GraphQL API (itinerary planning).
   * https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
   * @param {object} body - The JSON body of the HTTP request.
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
   */
  simplifyResJson: function (json, simplify) {
    if (simplify) {
      return json["data"]["plan"]["itineraries"].map((itinerary) => {
        // All trips invovled (walk, bus, tram)
        const trips = itinerary["legs"].map((leg) => ({
          id: require("uuid").v4(),
          mode: leg["mode"], // e.g. WALK, TRAM
          startTime: leg["startTime"],
          trip: leg["trip"], // e.g. M1 Matinkylä, null
          stop: leg["from"]["stop"],
        }));

        // The first public transport trip in the list
        const firstPublicTransportTrip = trips.find(
          (trip) => trip["mode"] !== "WALK"
        );

        return {
          // Generate ID
          id: require("uuid").v4(),

          // Total duration in minutes
          duration: checkZero(Math.floor(itinerary["duration"] / 60)),

          // Walk distance in meters
          walkDistance: checkZero(Math.floor(itinerary["walkDistance"])),

          startTime: itinerary["startTime"],
          endTime: itinerary["endTime"],

          // The first public transport you need to catch
          firstPublicTransportTrip,

          // All trips invovled (walk, bus, tram)
          trips,

          // All routes
          legs: itinerary["legs"].map((leg) => {
            return {
              id: require("uuid").v4(),
              mode: leg["mode"], // e.g. WALK, TRAM
              startTime: leg["startTime"],
              endTime: leg["endTime"],
              duration: checkZero(Math.floor(leg["duration"] / 60)), // Minutes
              distance: checkZero(Math.floor(leg["distance"])), // Meters
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
