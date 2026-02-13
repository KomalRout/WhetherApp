import { Drawer, Box } from "@mui/material";
import React, { Suspense } from "react";
import { LinearLoader } from "../Loader/Loader";
import "./SavedLocationList.css";
const SavedLocation = ({ handleFavBtnClick, unitType }) => {
  const MyLazyComponent = React.lazy(
    importDelay(() => import("./SavedLocationList")),
  );
  return (
    <Drawer anchor={"right"} open={true} onClose={handleFavBtnClick}>
      <Box
        sx={{
          width: 500,
          background: "var(--neutral-800)",
          height: "100%",
          padding: "20px",
          gap: "15px",
          display: "flex",
          flexDirection: "column",
        }}
        role="presentation"
      >
        <Suspense
          fallback={
            <div className="falback-loader">
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
