import React, { useState } from "react";
import { Grid, Tab, Tabs, Box, Container } from "@mui/material";
import WifiInfo from "./components/WifiInfo";
import ConnectedDevices from "./components/ConnectedDevices";
import BlacklistDevices from "./components/BlacklistDevices";
import QrCode from "./components/QrCode";
import ToggleWifi from "./components/ToggleWifi";
import ChangeWifiSettings from "./components/ChangeWifiSettings";
import SignalWifi3BarIcon from "@mui/icons-material/SignalWifi3Bar";
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined';
import BlockIcon from "@mui/icons-material/Block";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import SettingsIcon from "@mui/icons-material/Settings";
import { tokens } from "../../../theme/theme";

const WifiSettingsDash = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="white"
        indicatorColor="white"
        variant="scrollable"
        scrollButtons="auto"
        centered
        sx={{ mb: 2 }}
      >
        <Tab label="WiFi Info" icon={<SignalWifi3BarIcon />} />
        <Tab label="Connected Devices" icon={<DevicesOutlinedIcon />} />
        <Tab label="Blacklist Devices" icon={<BlockIcon />} />
        <Tab label="QR Code" icon={<QrCodeIcon />} />
        <Tab label="Toggle WiFi" icon={<ToggleOnOutlinedIcon />} />
        <Tab label="Change WiFi Settings" icon={<SettingsIcon />} />
      </Tabs>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Box p={3}>
            {selectedTab === 0 && <WifiInfo />}
            {selectedTab === 1 && <ConnectedDevices />}
            {selectedTab === 2 && <BlacklistDevices />}
            {selectedTab === 3 && <QrCode />}
            {selectedTab === 4 && <ToggleWifi />}
            {selectedTab === 5 && <ChangeWifiSettings />}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WifiSettingsDash;
