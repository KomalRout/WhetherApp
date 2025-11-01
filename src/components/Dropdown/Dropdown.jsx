import React from "react";
import "./Dropdown.css";

const Dropdown = ({ options, label, icon, onChange, ...props }) => {
  return (
    <div className="select-wrapper">
      {/* <label className="select-label">
        <span className="label-icon">⚖️</span>
        Unit
      </label> */}

      <select
        id={`${label}-select`}
        className="custom-select"
        onChange={(event) => {
          onChange(event.target.value);
        }}
      >
        {options.map((option, index) => (
          <option
            key={`${option.key}+${index}`}
            value={option.key}
            selected={option.key === props.todaysDay}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
