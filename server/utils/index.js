module.exports = {
  /**
   * Returns 1 if the input is less than 1, else returns the original input.
   * @param {number} num - A number.
   * @returns {number} 1 if the input is less than 1, else returns the original input.
   */
  zeroToOne: function (num) {
    if (num < 1) {
      return 1;
    }
    return num;
  },

  /**
   * Returns an array that contains all the previous letters in alphabet.
   * e.g. input "C" returns ["A", "B"].
   * @param {string} letter - An single alphabet letter in English.
   * @returns {string[]} e.g. ["A", "B"]
   */
  getPreviousLettersInAlphabet: function (letter) {
    let output = [];

    // Get the char code (65-90 A-Z)
    const charCode = letter.toUpperCase()[0].charCodeAt(0);

    // Add all previous letters all the way to A
    for (let i = 65; i < charCode; i += 1) {
      output = [...output, String.fromCharCode(i)];
    }

    return output;
  },

  /**
   * Check if an object has any invalid values
   * e.g. { one: "b", two: "" } returns "A Story of H".
   * @param {object} obj - An object.
   * @returns {bool} True or false.
   */
  hasInvalidValue: function (obj) {
    if (obj) {
      const arr = Object.values(obj);
      return arr.some((x) => x === "" || x === null || x === undefined);
    }
  },
};
