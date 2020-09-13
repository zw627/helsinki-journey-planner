import React from "react";
import AutorenewRoundedIcon from "@material-ui/icons/AutorenewRounded";
import { useSearchState } from "../../context/SearchContext";

const Loading = () => {
  const { isLoading } = useSearchState();

  return (
    <>{isLoading ? <AutorenewRoundedIcon className="loading-icon" /> : null}</>
  );
};

export default Loading;
