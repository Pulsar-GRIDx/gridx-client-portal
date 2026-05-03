import React from "react";
import { Paper, Typography, List, ListItem } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { wifiSettings } from "../data/data";

const BlacklistDevices = () => {
  return (
    <Paper elevation={3} sx={{ p: 2, textAlign: "center",backgroundColor: "rgba(255, 255, 255, 0.1)", m:"10px" }}>
      <BlockIcon />
      <Typography variant="h4">Blacklisted Devices</Typography>
      <List>
        {wifiSettings.blacklistedDevices.map((device, index) => (
          <ListItem key={index}>{device}</ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default BlacklistDevices;
