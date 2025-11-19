import "./search.css";
import { use, useEffect, useState } from "react";
import { setLatLong, setLocation } from "../../reducers/appSlice";
import { useDispatch } from "react-redux";
import { fetchLocationData } from "../../service";
import { CircleLoader } from "../Loader/Loader";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState(new Set());
  const dispatch = useDispatch();

  const handleOnChangeValue = (e) => {
    let value = e.target.value;
    setSearchValue(value?.trim() || "");
  };

  const onOptionClick = (item) => {
    dispatch(setLatLong({ longitude: item.long, latitude: item.lat }));
    setData(new Set());
    setSearchValue("");
    dispatch(setLocation(item.name));
  };

  useEffect(() => {
    if (searchValue === "") {
      setData(new Set());
      setSearchValue("");
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      let response = await fetchLocationData(searchValue);
      setData(response);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  return (
    <div className="search-container">
      <div>
        <input
          id="search-input"
          name="search-input"
          className="search-input"
          type="search"
          placeholder="Search for a place..."
          value={searchValue}
          onChange={(e) => handleOnChangeValue(e)}
        />
        {searchValue !== "" ? (
          <ul
            className={
              data?.length > 0
                ? "search-dropdown"
                : `search-dropdown search-loader`
            }
          >
            {data.length > 0 ? (
              data?.map((item) => (
                <li
                  key={item.name?.toLowerCase()?.trim()?.replace(",", "_")}
                  className="search-item"
                  onClick={() => onOptionClick(item)}
                >
                  {item?.name}
                </li>
              ))
            ) : (
              <p className="search-progress" key="search_in_progress">
                <span>
                  <CircleLoader />
                </span>
                <span>Search in progress...</span>
              </p>
            )}
          </ul>
        ) : (
          <></>
        )}
      </div>
      <button className="search-btn" type="submit">
        Search
      </button>
    </div>
  );
};

export default Search;
