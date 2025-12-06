import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLatLong, setLocation } from "./reducers/appSlice";
<<<<<<< HEAD
=======
import axios from "axios";
>>>>>>> 7d963a4365a46ae83e68da95481d118ae70a8ed1
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
<<<<<<< HEAD
      getCurrentLocationDetails(latitude, longitude)
        .then((res) => {
          console.log(res, typeof res);
          dispatch(setLocation(res));
        })
        .catch((error) => setError(true));
      dispatch(setLatLong({ latitude, longitude }));
=======
      let locationName = getCurrentLocationDetails(latitude, longitude);
      dispatch(setLatLong({ latitude, longitude }));
      dispatch(setLocation(locationName));
>>>>>>> 7d963a4365a46ae83e68da95481d118ae70a8ed1
    }

    function handleError(error) {
      setError(error.message);
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return { error, refresh };
};
