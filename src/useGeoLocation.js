import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLatLong, setLocation } from "./reducers/appSlice";
import axios from "axios";
import { getCurrentLocationDetails } from "./service";

export const useGeoLocation = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  const refresh = () => {
    setError(false);
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(true);
      return;
    }

    function handleSuccess(position) {
      const { latitude, longitude } = position.coords;
      let locationName = getCurrentLocationDetails(latitude, longitude);
      dispatch(setLatLong({ latitude, longitude }));
      dispatch(setLocation(locationName));
    }

    function handleError(error) {
      setError(error.message);
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return { error, refresh };
};
