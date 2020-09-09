/**
 * Get the current date.
 * @returns {string} e.g. "2020-09-04"
 */
export function getFormattedDate() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  return `${year}-${month}-${day}`;
}

/**
 * Get the current time.
 * @returns {string} e.g. 11:51:02.
 */
export function getFormattedTime() {
  const sec = new Date().getSeconds();
  const min = new Date().getMinutes();
  const hour = new Date().getHours();
  return `${hour}:${min}:${sec}`;
}

/**
 * Get the last day of the month.
 * e.g. September 2020 should returns 30.
 * @param {number} month - Month.
 * @returns {number} e.g. 30.
 */
export function getLastDay(month) {
  const year = new Date().getFullYear();
  return new Date(year, month, 0).getDate();
}

/**
 * Get hours and minutes from any time format that is supported by JavaScript.
 * e.g. It returns "13:48" from 1599648480989.
 * @param {string|number} time - e.g. 1599648480989, "Wed Sep 05 2020 13:49:04 GMT+0300 (Eastern European Summer Time)", etc.
 * @returns {string} e.g. "13:48"
 */
export function getHoursMinutes(time) {
  const hours = new Date(time).getHours();
  const minutes = new Date(time).getMinutes();

  return `${pad(hours)}:${pad(minutes)}`;
}

/**
 * Add leading 0 to a number that is smaller than 10 and remove all fractional digits.
 * @param {number} num - A number.
 * @returns {string} e.g. "05".
 */
export function pad(num) {
  if (num < 10) return "0" + Math.trunc(num).toString();
  return Math.trunc(num).toString();
}

/**
 * Debounce an operation.
 * @param {void} func - The function that you want to execute after the debounce time.
 * @param {number} wait - The amount of time you want the debounce function to wait after the last received action before executing func.
 * @returns {func} The function being passed as argument.
 */
export function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      // End the debounce
      timeout = null;
      // Execute the input function
      func(...args);
    };
    // Prevents the input function from executed
    clearTimeout(timeout);
    // Restart the debounce
    timeout = setTimeout(later, wait);
  };
}

/**
 * Capitalize the first character of each word in a sentence.
 * e.g. "A stoRy OF h" returns "A Story of H".
 * @param {string} string - Any sentences.
 * @returns {string} e.g. "A Story of H"
 */
export function toTitleCase(string) {
  // Save each word to an array
  let wordArray = string.toLowerCase().split(" ");

  // Capitalize the first character
  wordArray = wordArray.map((word) => word.charAt(0).toUpperCase() + word.substring(1));

  // Put each word back to a string
  return wordArray.join(" ");
}
