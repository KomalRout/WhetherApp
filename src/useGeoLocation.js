import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLatLong, setLocation } from "./reducers/appSlice";

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
      console.log(position);
      const { latitude, longitude } = position.coords;
      //let url = `https://us1.locationiq.com/v1/reverse?key=pk.95082acc4e35c8248b45d411ecce3c67&lat=${latitude}&lon=${longitude}&format=json&`;
      dispatch(setLatLong({ latitude, longitude }));
    }

    function handleError(error) {
      setError(error.message);
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return { error, refresh };
};
