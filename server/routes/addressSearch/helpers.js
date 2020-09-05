// Digitransit address search API
// https://digitransit.fi/en/developers/apis/2-geocoding-api/address-search/

// Restrict search results to only HSL region (by reittiopas.hsl.fi)
const boundaryPolygon =
  "boundary.polygon=25.5345%2060.2592%2C25.3881%2060.1693%2C25.3559%2060.103%2C25.3293%2059.9371%2C24.2831%2059.78402%2C24.2721%2059.95501%2C24.2899%2060.00895%2C24.3087%2060.01947%2C24.1994%2060.12753%2C24.1362%2060.1114%2C24.1305%2060.12847%2C24.099%2060.1405%2C24.0179%2060.1512%2C24.0049%2060.1901%2C24.0445%2060.1918%2C24.0373%2060.2036%2C24.0796%2060.2298%2C24.1652%2060.2428%2C24.3095%2060.2965%2C24.3455%2060.2488%2C24.428%2060.3002%2C24.5015%2060.2872%2C24.4888%2060.3306%2C24.5625%2060.3142%2C24.5957%2060.3242%2C24.6264%2060.3597%2C24.666%2060.3638%2C24.7436%2060.3441%2C24.9291%2060.4523%2C24.974%2060.5253%2C24.9355%2060.5131%2C24.8971%2060.562%2C25.0388%2060.5806%2C25.1508%2060.5167%2C25.1312%2060.4938%2C25.0385%2060.512%2C25.057%2060.4897%2C25.0612%2060.4485%2C25.1221%2060.4474%2C25.1188%2060.4583%2C25.149%2060.4621%2C25.1693%2060.5062%2C25.2242%2060.5016%2C25.3661%2060.4118%2C25.3652%2060.3756";

// oa (OpenAddresses), osm (OpenStreetMap), nlsfi (National Land Survey)
const sources = "sources=oa%2Cosm%2Cnlsfi";

module.exports = {
  /**
   * Set up the query string for Digitransit address search API.
   * https://digitransit.fi/en/developers/apis/2-geocoding-api/address-search/
   * @param {object} body - The JSON body of the HTTP request.
   */
  setupQuery: function (body) {
    // Convert object to proper url params, e.g. { text: Konemiehentie 2 } returns text=konemiehentie%202
    const querystring = require("querystring");
    const text = querystring.encode(body);
    return text + "&" + boundaryPolygon + "&lang=en" + "&" + sources;
  },

  /**
   * Simplify the response JSON object from Digitransit address search API.
   * https://digitransit.fi/en/developers/apis/2-geocoding-api/address-search/
   * @param {Object} json - The response JSON object from the API.
   * @param {boolean} simplify - True to simplify the object, false returns the original object.
   */
  simplifyResJson: function (json, simplify) {
    return json["features"].map((address) => {
      if (simplify) {
        // Convert label string to array
        const label = address["properties"]["label"].split(", ");

        // Name
        const labelPriamry = label[0];

        // Street, City
        const labelSecondary = label
          .filter((value, index) => {
            if (index > 0) return value;
          })
          .join(", ");

        return {
          labelPriamry,
          labelSecondary,
          coordinates: {
            lat: address["geometry"]["coordinates"][1],
            lon: address["geometry"]["coordinates"][0],
          },
        };
      }
      return json;
    });
  },
};
