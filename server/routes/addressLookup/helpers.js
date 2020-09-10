module.exports = {
  /**
   * Simplify the response JSON object from Digitransit address lookup API.
   * // https://digitransit.fi/en/developers/apis/2-geocoding-api/address-lookup/
   * @param {object} json - The response JSON object from the API.
   * @param {boolean} simplify - True to simplify the object, false returns the original object.
   * @returns {object} The simplified JSON object from Digitransit address lookup API.
   */
  simplifyResJson: function (json, simplify) {
    // addressLookup can use the same helper from addressSearch
    return require("../addressSearch/helpers").simplifyResJson(
      json["features"],
      simplify
    );
  },
};
