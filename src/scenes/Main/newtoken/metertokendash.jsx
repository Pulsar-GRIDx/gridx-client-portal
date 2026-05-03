import React, { useContext } from "react";
import SendToken from "./components/sendtoken";
import { Grid, Box } from "@mui/material";
import DisplayCard from "./components/Card";
import HomeIcon from "@mui/icons-material/Home";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AuthContext from "../../../context/AuthContext";

const Metertokendash = () => {
  const { userInfo } = useContext(AuthContext);

  const getDRN = () => {
    if (userInfo && userInfo.DRN) return userInfo.DRN;
    const saved = sessionStorage.getItem("user");
    if (saved) {
      try { return JSON.parse(saved).DRN; } catch (e) { return ""; }
    }
    return "";
  };

  const drn = getDRN();

  const MeterIconComponent = () => <HomeIcon />;
  const HeaterIconComponent = () => <LocalFireDepartmentIcon />;

  return (
    <Box sx={{ overflowY: "scroll", maxHeight: "95vh" }}>
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
          <SendToken drn={drn} />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <DisplayCard
            Title="Meter"
            drn={drn}
            controlType="mains"
            Icon={MeterIconComponent}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <DisplayCard
            Title="Geyser"
            drn={drn}
            controlType="heater"
            Icon={HeaterIconComponent}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Metertokendash;
