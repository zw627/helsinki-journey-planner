module.exports = {
  /**
   * Simplify the response JSON object from Digitransit address lookup API.
   * // https://digitransit.fi/en/developers/apis/2-geocoding-api/address-lookup/
   * @param {Object} json - The response JSON object from the API.
   * @param {boolean} simplify - True to simplify the object, false returns the original object.
   */
  simplifyResJson: function (json, simplify) {
    // addressLookup has the same JSON structure as addressSearch
    // Except json["features"] needs to be passed instead of json
    return require("../addressSearch/helpers").simplifyResJson(
      json["features"],
      simplify
    );
  },
};
