module.exports = {
  zeroToOne: function (num) {
    if (num < 1) {
      return 1;
    }
    return num;
  },

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
};
