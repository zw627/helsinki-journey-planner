// Digitransit itinerary planning API
// https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/

module.exports = {
  /**
   * Set up the JSON equivalent of GraphQL query for Digitransit itinerary planning API.
   * https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
   * @param {object} body - The JSON body of the HTTP request.
   */
  setupQuery: function (body) {
    // https://digitransit.fi/en/developers/apis/1-routing-api/0-graphql/
    return {
      query: `{
                plan(
                  from: {lat: ${body.origin.lat}, lon: ${body.origin.lon}},
                  to: {lat: ${body.destination.lat}, lon: ${body.destination.lon}},
                  numItineraries: 3,
                  date: "${body.date}",
                  time: "${body.time}",
                ) {
                  itineraries {
                    duration
                    walkDistance
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
   * Simplify the response JSON object from Digitransit itinerary planning API.
   * https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
   * @param {Object} json - The response JSON object from the API.
   * @param {boolean} simplify - True to simplify the object, false returns the original object.
   */
  simplifyResJson: function (json, simplify) {
    if (simplify) {
      return json["data"]["plan"]["itineraries"].map((itinerary) => {
        return {
          // Total duration in minutes
          duration: Math.floor(itinerary.duration / 60),

          // Walk distance in meters
          walkDistance: Math.floor(itinerary.walkDistance),

          // All routes
          legs: itinerary.legs.map((leg) => {
            return {
              mode: leg.mode, // e.g. WALK, TRAM
              startTime: new Date(leg.startTime), // UTC
              endTime: new Date(leg.endTime), // UTC
              duration: Math.floor(leg.duration / 60), // Minutes
              distance: Math.floor(leg.distance), // Meters
              trip: leg.trip, // e.g. M1 Matinkylä, null
              from: {
                name: leg.from.name,
                stop: leg.from.stop,
              },
              to: {
                name: leg.to.name,
                stop: leg.to.stop,
              },
            };
          }),
        };
      });
    }
    return json;
  },
};
