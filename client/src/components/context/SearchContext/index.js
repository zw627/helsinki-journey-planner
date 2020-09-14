import React from "react";

const SearchStateContext = React.createContext();
const SearchDispatchContex = React.createContext();

const initialState = {
  origin: {
    name: "",
    coordinates: { lat: 0.0, lon: 0.0 },
  },
  destination: {
    name: "",
    coordinates: { lat: 0.0, lon: 0.0 },
  },
  date: { month: "", day: "" },
  time: { hours: "", minutes: "" },
  itineraries: [],
  notification: {
    isPositive: false,
    text: "",
  },
  isLoading: false,
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case "setOrigin":
      return { ...state, origin: action.payload };
    case "setDestination":
      return { ...state, destination: action.payload };
    case "setDate":
      return { ...state, date: action.payload };
    case "setTime":
      return { ...state, time: action.payload };
    case "setItineraries":
      return { ...state, itineraries: action.payload };
    case "setNotification":
      return { ...state, notification: action.payload };
    case "setLoading":
      return { ...state, isLoading: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const SearchProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(searchReducer, initialState);
  return (
    <SearchStateContext.Provider value={state}>
      <SearchDispatchContex.Provider value={dispatch}>
        {children}
      </SearchDispatchContex.Provider>
    </SearchStateContext.Provider>
  );
};

// For consuming state
const useSearchState = () => {
  const context = React.useContext(SearchStateContext);
  if (context === undefined) {
    throw new Error("useSearchState must be used within a SearchProvider");
  }
  return context;
};

// For consuming actions
const useSearchDispatch = () => {
  const context = React.useContext(SearchDispatchContex);
  if (context === undefined) {
    throw new Error("useSearchDispatch must be used within a SearchProvider");
  }
  return context;
};

export { SearchProvider, useSearchState, useSearchDispatch };
