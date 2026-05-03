import React from "react";
import { Paper, Typography, Switch } from "@mui/material";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";
import { wifiSettings } from "../data/data";

const ToggleWifi = () => {
  const handleToggle = () => {
    // Code to toggle WiFi goes here
  };

  return (
    <Paper elevation={3} sx={{ p: 2, textAlign: "center",backgroundColor: "rgba(255, 255, 255, 0.1)", m:"10px" }}>
      <WifiTetheringIcon />
      <Typography variant="h4">Toggle WiFi</Typography>
      <Switch checked={true} onChange={handleToggle} />
    </Paper>
  );
};

export default ToggleWifi;
