import React from "react";
import SendToken from "./components/sendtoken";
import { Grid, Box } from "@mui/material";
import DisplayCard from "./components/Card";
import HomeIcon from "@mui/icons-material/Home";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

/**
 * @module MeterTokenDashBoard
 */

/**
 * @namespace MeterTokenDashBoard.MeterTokenDashBoard_components
 */

/**
 * The Metertokendash component renders the dashboard for meter and heater control.
 *
 * @component
 * @example
 * return <Metertokendash />;
 *
 * @returns {JSX.Element} The rendered meter token dashboard component.
 */
const Metertokendash = () => {
  const APIPostMeter = "https://backend1.gridxmeter.com/turn-meter-on-off";
  const APIGetMeter = "https://backend1.gridxmeter.com/get-meter-state";

  const APIPostHeater = "https://backend1.gridxmeter.com/turn-heater-on-off";
  const APIGetHeater = "https://backend1.gridxmeter.com/get-heater-state";

  /**
   * Component for rendering the meter icon.
   *
   * @returns {JSX.Element} The meter icon component.
   */
  const MeterIconComponent = () => <HomeIcon />;

  /**
   * Component for rendering the heater icon.
   *
   * @returns {JSX.Element} The heater icon component.
   */
  const HeaterIconComponent = () => <LocalFireDepartmentIcon />;

  return (
    <Box
      sx={{
        overflowY: "scroll",
        maxHeight: "95vh",
      }}
    >
      <Grid
        container
        spacing
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "space-between",
          width: "100%",
        }}
      >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <SendToken />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <DisplayCard
            Title="Meter"
            APIPost={APIPostMeter}
            APIGet={APIGetMeter}
            Icon={MeterIconComponent}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <DisplayCard
            Title="Geyser"
            APIPost={APIPostHeater}
            APIGet={APIGetHeater}
            Icon={HeaterIconComponent}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Metertokendash;
