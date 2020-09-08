// e.g. 2020-09-04
export function getFormattedDate() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  return `${year}-${month}-${day}`;
}

// e.g. 11:51:02
export function getFormattedTime() {
  const sec = new Date().getSeconds();
  const min = new Date().getMinutes();
  const hour = new Date().getHours();
  return `${hour}:${min}:${sec}`;
}

// e.g. 11:51
export function getHoursMinutes(time) {
  const hours = new Date(time).getHours();
  const minutes = new Date(time).getMinutes();

  return `${pad(hours)}:${pad(minutes)}`;
}

// Add leading 0 to a number that is smaller than 10
// and remove all fractional digits
export function pad(num) {
  if (num < 10) return "0" + Math.trunc(num).toString();
  return Math.trunc(num).toString();
}
