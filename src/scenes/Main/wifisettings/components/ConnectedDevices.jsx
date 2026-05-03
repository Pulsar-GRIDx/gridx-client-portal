import React from "react";
import { Paper, Typography, List, ListItem } from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import { wifiSettings } from "../data/data";

const ConnectedDevices = () => {
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
      <DevicesIcon />
      <Typography variant="h4">Connected Devices</Typography>
      <List>
        {wifiSettings.connectedDevices.map((device, index) => (
          <ListItem key={index}>{device}</ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ConnectedDevices;
