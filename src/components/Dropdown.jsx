import React from "react";
import "./Dropdown.css";

const Dropdown = ({ options, label, icon }) => {
  return (
    <div className="select-wrapper">
      {/* <label className="select-label">
        <span className="label-icon">⚖️</span>
        Unit
      </label> */}

      <select className="custom-select">
        <option value="">Unit</option>
        <option value="kg">Kilograms (kg)</option>
        <option value="lb">Pounds (lb)</option>
        <option value="g">Grams (g)</option>
      </select>
    </div>
  );
};

export default Dropdown;
