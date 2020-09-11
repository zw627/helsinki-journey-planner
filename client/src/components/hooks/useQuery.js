import { useLocation } from "react-router-dom";
import { getCurrentDate, getCurrentTime } from "../../utils";

// Get URL params
function useQuery() {
  return new URLSearchParams(decodeURIComponent(useLocation().search));
}

// Extract each URL param, and return a JSON object that contains the data
export default function useQueryString(isInitializing) {
  const query = useQuery();

  if (isInitializing) {
    const addresses = ["origin", "destination"].map((addressType) => ({
      name: query.get(addressType + "-name"),
      coordinates: {
        lat: parseFloat(query.get(addressType + "-lat")),
        lon: parseFloat(query.get(addressType + "-lon")),
      },
    }));
    const date = query.get("date") ? query.get("date") : getCurrentDate();
    const time = query.get("time") ? query.get("time") : getCurrentTime();

    return {
      origin: addresses[0],
      destination: addresses[1],
      date,
      time,
    };
  }
}
