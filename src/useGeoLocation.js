import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLatLong, setLocation } from "./reducers/appSlice";
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
      getCurrentLocationDetails(latitude, longitude)
        .then((res) => {
          console.log(res, typeof res);
          dispatch(setLocation(res));
        })
        .catch((error) => setError(true));
      dispatch(setLatLong({ latitude, longitude }));
    }

    function handleError(error) {
      setError(error.message);
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return { error, refresh };
};
