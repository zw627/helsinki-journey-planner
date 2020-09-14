import Axios from "axios";

import {
  getCurrentDay,
  getCurrentHours,
  getCurrentMinutes,
  getCurrentMonth,
  hasInvalidValue,
  pad,
} from "../../../utils";

export function dispatchSetDateTime(dispatch, params) {
  const { month, day, hours, minutes } = params;
  dispatch({
    type: "setDate",
    payload: {
      month: pad(month),
      day: pad(day),
    },
  });
  dispatch({
    type: "setTime",
    payload: {
      hours: pad(hours),
      minutes: pad(minutes),
    },
  });
}

export function dispatchSetCurrentDateTime(dispatch) {
  dispatchSetDateTime(dispatch, {
    month: getCurrentMonth(),
    day: getCurrentDay(),
    hours: getCurrentHours(),
    minutes: getCurrentMinutes(),
  });
}

export function dispatchSetExtractedDateTime(dispatch, params) {
  const date = params.date.split("-");
  const time = params.time.split(":");

  dispatchSetDateTime(dispatch, {
    month: date[1],
    day: date[2],
    hours: time[0],
    minutes: time[1],
  });
}

async function fetchAddressName(coordinates) {
  try {
    const res = await Axios.post(
      process.env.REACT_APP_API_ADDRESS_LOOKUP,
      coordinates
    );
    return res.data[0]["labelPriamry"];
  } catch (err) {
    return "Unknown location";
  }
}

export async function fetchItineraries(state, dispatch, history, params) {
  try {
    const {
      origin,
      destination,
      combinedDate,
      combinedTime,
      saveDateTimeToQueries,
    } = params;
    dispatch({ type: "setLoading", payload: true });

    // If all params are valid
    if (
      !hasInvalidValue(origin) &&
      !hasInvalidValue(destination) &&
      combinedDate &&
      combinedTime
    ) {
      let query;
      let title;
      let originName = origin["name"];
      let destName = destination["name"];
      const originCoordinates = origin["coordinates"];
      const destCoordinates = destination["coordinates"];

      // Fetch
      const res = await Axios.post(
        process.env.REACT_APP_API_ITINERARY_PLANNING,
        {
          origin: {
            coordinates: originCoordinates,
          },
          destination: {
            coordinates: destCoordinates,
          },
          date: combinedDate,
          time: combinedTime,
        }
      );
      dispatch({ type: "setItineraries", payload: res.data });
      dispatch({ type: "setLoading", payload: false });

      // If geolocation, fetch name of the coordinates
      if (originName === "Your current location") {
        originName = await fetchAddressName(originCoordinates);
      } else if (destName === "Your current location") {
        destName = await fetchAddressName(destCoordinates);
      }

      if (saveDateTimeToQueries) {
        query = `origin-name=${originName}&origin-lat=${originCoordinates["lat"]}&origin-lon=${originCoordinates["lon"]}&destination-name=${destName}&destination-lat=${destCoordinates["lat"]}&destination-lon=${destCoordinates["lon"]}&date=${combinedDate}&time=${combinedTime}`;
        title = `Itineraries | ${originName} to ${destName} - ${combinedDate} ${combinedTime}`;
      } else {
        query = `origin-name=${originName}&origin-lat=${originCoordinates["lat"]}&origin-lon=${originCoordinates["lon"]}&destination-name=${destName}&destination-lat=${destCoordinates["lat"]}&destination-lon=${destCoordinates["lon"]}`;
        title = `Itineraries | ${originName} to ${destName}`;
      }

      // Push params to URL
      const encodedQuery = `?${encodeURIComponent(query)}`;
      history.push({ search: encodedQuery });

      // Update title
      document.title = title;
    }
  } catch (err) {
    // Do not unmount the current itineraries if exists (set time)
    if (!state.itineraries.length > 0) {
      dispatch({ type: "setItineraries", payload: [] });
    }
    dispatch({ type: "setLoading", payload: false });
    dispatch({
      type: "setNotification",
      payload: { isPositive: false, text: err.response.data.message },
    });
  }
}
