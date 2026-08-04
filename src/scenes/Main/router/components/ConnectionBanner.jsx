import React, { useState } from "react";
import { Box, Typography, Chip, IconButton, TextField, Button, Collapse } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import WifiTetheringIcon from "@mui/icons-material/WifiTethering";
import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import WifiTetheringOffIcon from "@mui/icons-material/WifiTetheringOff";
import { getRouterHost, setRouterHost } from "../../../../services/routerApi";

const SOURCE_CONFIG = {
  local: {
    icon: WifiTetheringIcon,
    color: "#22c55e",
    title: "Connected to router directly",
    detail: () => `Live data from ${getRouterHost()} — your browser is on the router's own network.`,
  },
  tunnel: {
    icon: WifiTetheringIcon,
    color: "#22c55e",
    title: "Connected via secure tunnel",
    detail: () => "Live data relayed through the backend, not a direct local connection.",
  },
  demo: {
    icon: WifiTetheringOffIcon,
    color: null, // uses theme-dependent neutral, set below
    title: "Router not reachable — showing example data",
    detail: () =>
      "Direct local access needs your browser on the router's own Wi-Fi/network. Remote access needs the backend↔meter relay, which isn't live yet — see the ISP Remote Management docs.",
  },
};

const ConnectionBanner = ({ source, onHostChange }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [editing, setEditing] = useState(false);
  const [hostInput, setHostInput] = useState(getRouterHost());

  const cfg = SOURCE_CONFIG[source] || SOURCE_CONFIG.demo;
  const Icon = cfg.icon;
  const iconColor = cfg.color || (isDark ? "#64748b" : "#94a3b8");
  const isLive = source === "local" || source === "tunnel";

  const save = () => {
    setRouterHost(hostInput);
    setEditing(false);
    onHostChange();
  };

  return (
    <Box
      sx={{
        mb: 3, p: 2, borderRadius: 2,
        bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Icon sx={{ color: iconColor, fontSize: 20 }} />
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              {cfg.title}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: isDark ? "#64748b" : "#94a3b8" }}>
              {cfg.detail()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {source === "tunnel" && (
            <RouterOutlinedIcon sx={{ fontSize: 15, color: isDark ? "#64748b" : "#94a3b8" }} titleAccess="Via tunnel" />
          )}
          <Chip
            label={isLive ? (source === "local" ? "Live · Local" : "Live · Tunnel") : "Demo"}
            size="small"
            sx={{
              height: 20, fontSize: 10, fontWeight: 700,
              bgcolor: isLive ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.15)",
              color: isLive ? "#22c55e" : (isDark ? "#94a3b8" : "#64748b"),
            }}
          />
          <IconButton size="small" onClick={() => setEditing((e) => !e)} sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>
            <SettingsIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={editing}>
        <Box sx={{ mt: 2, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            size="small"
            label="Router address"
            value={hostInput}
            onChange={(e) => setHostInput(e.target.value)}
            placeholder="192.168.8.1"
            sx={{ minWidth: 200 }}
          />
          <Button variant="contained" size="small" onClick={save} sx={{ textTransform: "none" }}>
            Save & Reconnect
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ConnectionBanner;
