import { Delete } from "@mui/icons-material";
import { Box, List } from "@mui/material";
import React, { use, useEffect } from "react";
import { getTempForFavoriteLocation } from "../../service";

const SavedLocationList = () => {
  const favoriteLocationList = JSON.parse(
    localStorage.getItem("favoriteLocations"),
  );
  const [updatedFavLocList, setUpdatedFavLocList] = React.useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      let data = await getTempForFavoriteLocation(favoriteLocationList);
      setUpdatedFavLocList(data);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, []);

  console.log(updatedFavLocList);

  return (
    updatedFavLocList &&
    updatedFavLocList.length > 0 &&
    (updatedFavLocList ?? []).map((location, index) => (
      <List key={index}>
        {location.cityName} - {location.temp}°C
        <Delete />
      </List>
    ))
  );
};

export default SavedLocationList;
