import React, { useState } from "react";
import { Paper, Typography, TextField, Button } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { wifiSettings } from "../data/data";

const ChangeWifiSettings = () => {
  const [newWifiName, setNewWifiName] = useState("");
  const [newWifiPassword, setNewWifiPassword] = useState("");

  const handleSave = () => {
    // Code to save new WiFi settings goes here
    console.log("New WiFi Name:", newWifiName);
    console.log("New WiFi Password:", newWifiPassword);
  };

  const handleReset = () => {
    // Code to reset WiFi settings to default goes here
    setNewWifiName("");
    setNewWifiPassword("");
  };

  return (
    <Paper elevation={3} sx={{ p: 2, textAlign: "center",backgroundColor: "rgba(255, 255, 255, 0.1)", m:"10px"  }}>
      <SettingsIcon />
      <Typography variant="h4">Change WiFi Settings</Typography>
      <TextField
        label="New WiFi Name"
        variant="outlined"
        fullWidth
        value={newWifiName}
        onChange={(e) => setNewWifiName(e.target.value)}
        sx={{ my: 1 }}
      />
      <TextField
        label="New WiFi Password"
        variant="outlined"
        fullWidth
        value={newWifiPassword}
        onChange={(e) => setNewWifiPassword(e.target.value)}
        sx={{ my: 1 }}
      />
      <Button onClick={handleSave} variant="contained" sx={{ mr: 1 }}>
        Save
      </Button>
      <Button onClick={handleReset} variant="contained" color="error">
        Reset to Default
      </Button>
    </Paper>
  );
};

export default ChangeWifiSettings;
