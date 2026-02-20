import { Drawer, Box } from "@mui/material";
import React, { Suspense } from "react";
import { LinearLoader } from "../Loader/Loader";
import "./SavedLocationList.css";
const SavedLocation = ({ handleFavBtnClick, unitType }) => {
  const MyLazyComponent = React.lazy(
    importDelay(() => import("./SavedLocationList")),
  );
  return (
    <Drawer
      anchor={"right"}
      open={true}
      onClose={handleFavBtnClick}
      aria-label="Saved Locations Drawer"
    >
      <Box
        sx={{
          width: {
            xs: 325,
            sm: 325,
            md: 500,
            lg: 500,
          },
          background: "var(--neutral-800)",
          height: "100%",
          padding: "20px",
          gap: "15px",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
        aria-label="Saved Locations Content"
      >
        <Suspense
          fallback={
            <div
              className="falback-loader"
              aria-label="Loading Saved Locations"
            >
              <LinearLoader />
            </div>
          }
        >
          <MyLazyComponent unitType={unitType} />
        </Suspense>
      </Box>
    </Drawer>
  );
};

export default React.memo(SavedLocation);

export const importDelay =
  (importFn, delayMs = 3000) =>
  async () => {
    const [result] = await Promise.all([
      importFn(),
      new Promise((resolve) => setTimeout(resolve, delayMs)),
    ]);
    return result;
  };
