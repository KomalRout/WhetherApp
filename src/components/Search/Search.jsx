import "./search.css";
import { useEffect, useState } from "react";
import { setLatLong, setLocation } from "../../reducers/appSlice";
import { useDispatch } from "react-redux";
import { fetchLocationData } from "../../service";
import { CircleLoader } from "../Loader/Loader";
import { Input, InputAdornment, TextField } from "@mui/material";

const Search = (props) => {
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
      if (response?.length === 0) {
        props.setSearchFound(false);
        return;
      }
      props.setSearchFound(true);
      setData(response);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  return (
    <div className="search-container">
      <div>
        <Input
          id="search-input"
          name="search-input"
          className="search-input"
          classes={{ root: "search-input" }}
          type="search"
          placeholder="Search for a place..."
          value={searchValue}
          onChange={(e) => handleOnChangeValue(e)}
          autoComplete="off"
          startAdornment={
            <InputAdornment position="start">
              <img alt="search" src="public/assets/images/icon-search.svg" />
            </InputAdornment>
          }
          disableUnderline
          sx={{
            color: "var(--neutral-200)",
<<<<<<< HEAD
=======
            // borderRadius: "5px",

            // bgcolor: "var(--neutral-800)",
            // padding: "16px 24px",
            // width: "100%",
            // height: "56px",
>>>>>>> 7d963a4365a46ae83e68da95481d118ae70a8ed1
          }}
        />
        {searchValue !== "" ? (
          props?.searchFound && (
            <ul
              className={
                data?.length > 0
                  ? "search-dropdown"
                  : `search-dropdown search-loader`
              }
            >
              {data.length > 0
                ? data?.map((item) => (
                    <li
                      key={item.name?.toLowerCase()?.trim()?.replace(",", "_")}
                      className="search-item"
                      onClick={() => onOptionClick(item)}
                    >
                      {item?.name}
                    </li>
                  ))
                : props?.searchFound && (
                    <p className="search-progress" key="search_in_progress">
                      <span>
                        <CircleLoader />
                      </span>
                      <span>Search in progress...</span>
                    </p>
                  )}
            </ul>
          )
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
