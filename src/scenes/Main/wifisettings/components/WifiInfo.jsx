import React from "react";
import { Paper, Typography } from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import SignalWifi3BarIcon from "@mui/icons-material/SignalWifi3Bar";
import { wifiSettings } from "../data/data";

const WifiInfo = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        textAlign: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        m: "10px",
      }}
    >
      <WifiIcon />
      <Typography variant="h4">{wifiSettings.wifiName}</Typography>
      <Typography variant="h5">
        {`Signal Strength: ${wifiSettings.signalStrength}%`}{" "}
        <SignalWifi3BarIcon />
      </Typography>
    </Paper>
  );
};

export default WifiInfo;
