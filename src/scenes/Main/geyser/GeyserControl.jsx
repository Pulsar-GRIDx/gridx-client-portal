import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, Grid, Switch, Tabs, Tab, Chip,
  CircularProgress, Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { meterDataAPI, meterControlAPI, vendingAPI } from "../../../services/api";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";

function GeyserControl() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";

  const [tab, setTab] = useState(0);
  const [heaterState, setHeaterState] = useState(false);
  const [mainsState, setMainsState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [dsmConfig, setDsmConfig] = useState(null);

  useEffect(() => {
    if (!drn) return;
    meterDataAPI.getHeaterState(drn).then(d => {
      const data = d?.data || d;
      setHeaterState(data?.heater_state === "1" || data?.heater_state === 1 || data?.state === "1");
    }).catch(() => {});
    meterDataAPI.getMainsState(drn).then(d => {
      const data = d?.data || d;
      setMainsState(data?.mains_state === "1" || data?.mains_state === 1 || data?.state === "1");
    }).catch(() => {});
    vendingAPI.getDSMConfig(drn).then(d => setDsmConfig(d?.data || d)).catch(() => {});
  }, [drn]);

  const toggleControl = async (type, newState) => {
    setLoading(true);
    setMessage(null);
    try {
      const stateVal = newState ? "1" : "0";
      if (type === "heater") {
        await meterControlAPI.setHeaterControl(drn, stateVal, "Customer Portal");
        setHeaterState(newState);
      } else {
        await meterControlAPI.setMainsControl(drn, stateVal, "Customer Portal");
        setMainsState(newState);
      }
      setMessage({ type: "success", text: `${type === "heater" ? "Geyser" : "Mains"} turned ${newState ? "ON" : "OFF"}. Command sent.` });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to send command" });
    }
    setLoading(false);
  };

  const cardSx = {
    p: 3, borderRadius: 3,
    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
  };

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Geyser Control</Typography>
        <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
          Manage your geyser and mains power
        </Typography>
      </Box>

      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2, borderRadius: 2 }}>
          {message.text}
        </Alert>
      )}

      <Tabs
        value={tab} onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3, minHeight: 40,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: 13, minHeight: 40, py: 1 },
          "& .MuiTabs-indicator": { borderRadius: 2, height: 3 },
        }}
      >
        <Tab label="Manual Control" icon={<PowerSettingsNewRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="DSM Settings" icon={<ScheduleRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardSx}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: 2,
                  bgcolor: heaterState ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <WaterDropRoundedIcon sx={{ fontSize: 26, color: heaterState ? "#22c55e" : "#ef4444" }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                    Geyser / Hot Water
                  </Typography>
                  <Chip
                    label={heaterState ? "ON" : "OFF"} size="small"
                    sx={{
                      mt: 0.5, fontWeight: 600, fontSize: 11,
                      bgcolor: heaterState ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: heaterState ? "#22c55e" : "#ef4444",
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>
                  Toggle geyser power
                </Typography>
                {loading ? <CircularProgress size={24} /> : (
                  <Switch
                    checked={heaterState}
                    onChange={(e) => toggleControl("heater", e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#22c55e" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#22c55e" },
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={cardSx}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 48, height: 48, borderRadius: 2,
                  bgcolor: mainsState ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <PowerSettingsNewRoundedIcon sx={{ fontSize: 26, color: mainsState ? "#22c55e" : "#ef4444" }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                    Mains Power
                  </Typography>
                  <Chip
                    label={mainsState ? "ON" : "OFF"} size="small"
                    sx={{
                      mt: 0.5, fontWeight: 600, fontSize: 11,
                      bgcolor: mainsState ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: mainsState ? "#22c55e" : "#ef4444",
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>
                  Toggle mains power
                </Typography>
                {loading ? <CircularProgress size={24} /> : (
                  <Switch
                    checked={mainsState}
                    onChange={(e) => toggleControl("mains", e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#22c55e" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#22c55e" },
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Paper elevation={0} sx={cardSx}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Demand Side Management (DSM)
          </Typography>
          {dsmConfig ? (
            <Grid container spacing={2}>
              {Object.entries(dsmConfig).filter(([k]) => !k.startsWith("_") && k !== "id" && k !== "DRN").map(([key, val], i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Box sx={{
                    p: 2, borderRadius: 2,
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}`,
                  }}>
                    <Typography sx={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5 }}>
                      {key.replace(/_/g, " ")}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                      {String(val)}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography sx={{ color: isDark ? "#475569" : "#94a3b8", fontSize: 13 }}>
              No DSM configuration available for this meter.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
}

export default GeyserControl;
