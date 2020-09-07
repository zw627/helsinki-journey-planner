// e.g. 2020-09-04
export const getFormattedDate = () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  return `${year}-${month}-${day}`;
};

// e.g. 11:51:02
export const getFormattedTime = () => {
  const sec = new Date().getSeconds();
  const min = new Date().getMinutes();
  const hour = new Date().getHours();
  return `${hour}:${min}:${sec}`;
};
