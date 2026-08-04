import React, { useContext, useEffect, useState, useCallback } from "react";
import { Box, Tab, Tabs, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import WifiIcon from "@mui/icons-material/Wifi";
import LanOutlinedIcon from "@mui/icons-material/LanOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ConnectionBanner from "./components/ConnectionBanner";
import RouterOverview from "./components/RouterOverview";
import RouterWifiTab from "./components/RouterWifiTab";
import RouterNetworkTab from "./components/RouterNetworkTab";
import RouterSecurityTab from "./components/RouterSecurityTab";
import { getRouterSnapshot } from "../../../services/routerApi";
import AuthContext from "../../../context/AuthContext";

const RouterDash = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN;
  const [selectedTab, setSelectedTab] = useState(0);
  const [snapshot, setSnapshot] = useState(null);

  // getRouterSnapshot tries local (direct to the router's LAN IP) first,
  // then the backend/meter tunnel for this DRN, then falls back to demo
  // data — see services/routerApi.js and
  // gridx-router-console/docs/METER_RELAY_TUNNEL_EVALUATION.md.
  const load = useCallback(async () => {
    setSnapshot(null);
    const data = await getRouterSnapshot(drn);
    setSnapshot(data);
  }, [drn]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Router</Typography>
        <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
          View your GRIDx gateway router's status and network configuration
        </Typography>
      </Box>

      {snapshot && <ConnectionBanner source={snapshot.source} onHostChange={load} />}

      <Tabs
        value={selectedTab}
        onChange={(_, v) => setSelectedTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: 3,
          "& .MuiTabs-indicator": { bgcolor: isDark ? "#4b86ff" : "#0d4fdb" },
          "& .MuiTab-root": {
            textTransform: "none", fontSize: 12, fontWeight: 500, minHeight: 44,
            color: isDark ? "#94a3b8" : "#64748b",
            "&.Mui-selected": { color: isDark ? "#4b86ff" : "#0d4fdb" },
          },
        }}
      >
        <Tab label="Overview" icon={<DashboardOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Wi-Fi" icon={<WifiIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Network" icon={<LanOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Security" icon={<LockOutlinedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
      </Tabs>

      {!snapshot ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Box>
          {selectedTab === 0 && <RouterOverview snapshot={snapshot} />}
          {selectedTab === 1 && <RouterWifiTab snapshot={snapshot} />}
          {selectedTab === 2 && <RouterNetworkTab snapshot={snapshot} />}
          {selectedTab === 3 && <RouterSecurityTab snapshot={snapshot} />}
        </Box>
      )}
    </Box>
  );
};

export default RouterDash;
