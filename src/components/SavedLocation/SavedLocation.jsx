import { Drawer, Box } from "@mui/material";
import React, { Suspense } from "react";
import SavedLocationList from "./SavedLocationList";
import { CircleLoader, LinearLoader } from "../Loader/Loader";

const SavedLocation = ({ handleFavBtnClick }) => {
  return (
    <Drawer anchor={"right"} open={true} onClose={handleFavBtnClick}>
      <Box
        sx={{
          width: 500,
          background: "var(--neutral-900)",
          height: "100%",
          padding: "20px",
        }}
        role="presentation"
      >
        <Suspense fallback={<LinearLoader />}>
          <SavedLocationList />
        </Suspense>
      </Box>
    </Drawer>
  );
};

export default SavedLocation;
