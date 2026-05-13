import React, { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WifiInfo from "./components/WifiInfo";
import ConnectedDevices from "./components/ConnectedDevices";
import BlacklistDevices from "./components/BlacklistDevices";
import QrCode from "./components/QrCode";
import ToggleWifi from "./components/ToggleWifi";
import ChangeWifiSettings from "./components/ChangeWifiSettings";
import SignalWifi3BarIcon from "@mui/icons-material/SignalWifi3Bar";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import BlockIcon from "@mui/icons-material/Block";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import SettingsIcon from "@mui/icons-material/Settings";

const WifiSettingsDash = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>WiFi Settings</Typography>
        <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
          Manage your meter WiFi configuration
        </Typography>
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(_, v) => setSelectedTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": { bgcolor: isDark ? "#60a5fa" : "#2563eb" },
          "& .MuiTab-root": {
            textTransform: "none", fontSize: 12, fontWeight: 500, minHeight: 44,
            color: isDark ? "#94a3b8" : "#64748b",
            "&.Mui-selected": { color: isDark ? "#60a5fa" : "#2563eb" },
          },
        }}
      >
        <Tab label="WiFi Info" icon={<SignalWifi3BarIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Devices" icon={<DevicesOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Blacklist" icon={<BlockIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="QR Code" icon={<QrCodeIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Toggle" icon={<ToggleOnOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Settings" icon={<SettingsIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
      </Tabs>

      <Box>
        {selectedTab === 0 && <WifiInfo />}
        {selectedTab === 1 && <ConnectedDevices />}
        {selectedTab === 2 && <BlacklistDevices />}
        {selectedTab === 3 && <QrCode />}
        {selectedTab === 4 && <ToggleWifi />}
        {selectedTab === 5 && <ChangeWifiSettings />}
      </Box>
    </Box>
  );
};

export default WifiSettingsDash;
