import { Delete, Warning } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { getTempForFavoriteLocation } from "../../service/service";
import WeatherIcon from "../WeatherIconAndAnimation/WeatherIcon";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import "./savedLocationList.css";

const SavedLocationList = ({ unitType }) => {
  const favoriteLocationList = JSON.parse(
    localStorage.getItem("favoriteLocations"),
  );
  const [updatedFavLocList, setUpdatedFavLocList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let data = await getTempForFavoriteLocation(
        favoriteLocationList,
        unitType,
      );
      setUpdatedFavLocList(data);
      //localStorage.setItem("favoriteLocations", JSON.stringify(data));
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const deleteFavLocation = (id) => {
    let updatedFavLocs = favoriteLocationList.filter((loc) => loc.id !== id);
    localStorage.setItem("favoriteLocations", JSON.stringify(updatedFavLocs));
    setUpdatedFavLocList((prev) => prev.filter((loc) => loc.id !== id));
  };

  if (error) {
    return (
      <div className="no-list" aria-label="No Saved Locations">
        <Warning aria-hidden="true" />
        <p>Error fetching data. Please try again later.</p>
      </div>
    );
  }
  return !loading ? (
    updatedFavLocList.length > 0 ? (
      updatedFavLocList.map((location, index) => (
        <li
          key={location.id}
          className={`save-location-item`}
          aria-label={`Saved location: ${location.cityName}`}
        >
          <p className="city-name">{location.cityName}</p>
          <div className="save-location-item-temp-info">
            <WeatherIcon code={location.weatherCode} aria-hidden="true" />
            <p className="temp">{location.temp}°</p>
          </div>
          <Delete
            titleAccess="delete"
            onClick={() => deleteFavLocation(location.id)}
            aria-label={`Delete saved location: ${location.cityName}`}
          />
        </li>
      ))
    ) : (
      <div className="no-list" aria-label="No Saved Locations">
        <InboxOutlinedIcon fontSize="large" />
        <p>No List</p>
      </div>
    )
  ) : (
    <div className="falback-loader">
      <p>Loading...</p>
    </div>
  );
};

export default React.memo(SavedLocationList);
