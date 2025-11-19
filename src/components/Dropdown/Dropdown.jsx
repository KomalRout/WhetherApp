import React, { useEffect, useRef, useState } from "react";
import "./Dropdown.css";
import {
  Box,
  ClickAwayListener,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";

const Dropdown = ({ options, label, icon, onChange, ...props }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    onChange(event?.target?.ariaLabel);
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl(null);
  };

  const handleToggle = (event) => {
    setAnchorEl(Boolean(anchorEl) ? null : event.currentTarget);
  };

  return (
    <div className="select-wrapper">
      <button className="custom-dropdown-button" onClick={handleToggle}>
        {icon && <img className="button-icon" src={icon} />}
        {label && (
          <span className="button-label" onClick={handleToggle}>
            {label}
          </span>
        )}
        <img src="public/assets/images/icon-dropdown.svg" />
      </button>
      <Menu
        elevation={0}
        id="positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        classes={{ list: "custom-dropdown-popper" }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <MenuList
            className="custom-dropdown-list"
            disablePadding={true}
            id="menu-list"
          >
            {options.map((option) => {
              let isGroupHeader = option.hasOwnProperty("group");
              if (isGroupHeader) {
                return (
                  <div>
                    <ListSubheader
                      key={option.group}
                      sx={{
                        color: "var(--neutral-300)",
                        bgcolor: "var(--neutral-800)",
                      }}
                    >
                      {option.groupLabel}
                    </ListSubheader>
                    {option.options?.map((subOption) => {
                      return (
                        <MenuItem
                          key={subOption.key}
                          aria-label={subOption?.key}
                        >
                          <ListItemText> {subOption.label} </ListItemText>
                          {subOption?.selected && (
                            <img src="public/assets/images/icon-checkmark.svg" />
                          )}
                        </MenuItem>
                      );
                    })}
                    {option !== options[options.length - 1] && (
                      <Divider className="divider" />
                    )}
                  </div>
                );
              }
              return (
                <MenuItem
                  key={option.key}
                  aria-label={option?.key}
                  onClick={handleClick}
                  value={option.key}
                >
                  {option.label}
                </MenuItem>
              );
            })}
          </MenuList>
        </ClickAwayListener>
      </Menu>
    </div>
  );
};

export default Dropdown;
