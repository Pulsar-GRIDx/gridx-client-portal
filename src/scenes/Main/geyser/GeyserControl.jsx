import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, Grid, Switch, Tabs, Tab, Chip, Button, TextField,
  CircularProgress, Alert, IconButton, Select, MenuItem, FormControl, InputLabel,
  Checkbox, FormControlLabel, FormGroup, Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { meterDataAPI, meterControlAPI, geyserAPI } from "../../../services/api";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import PowerSettingsNewRoundedIcon from "@mui/icons-material/PowerSettingsNewRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  const [geyserConfig, setGeyserConfig] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerStartedAt, setTimerStartedAt] = useState(null);

  const [newStartHour, setNewStartHour] = useState(6);
  const [newStartMin, setNewStartMin] = useState(0);
  const [newEndHour, setNewEndHour] = useState(8);
  const [newEndMin, setNewEndMin] = useState(0);
  const [newDays, setNewDays] = useState([1, 1, 1, 1, 1, 0, 0]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const cardSx = {
    p: 3, borderRadius: 3,
    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
  };

  useEffect(() => {
    if (!drn) return;
    meterDataAPI.getHeaterState(drn).then(d => {
      const data = d?.data || d;
      setHeaterState(String(data?.state || data?.heater_state || "0") === "1");
    }).catch(() => {});
    meterDataAPI.getMainsState(drn).then(d => {
      const data = d?.data || d;
      setMainsState(String(data?.state || data?.mains_state || "0") === "1");
    }).catch(() => {});
    loadGeyserConfig();
  }, [drn]);

  const loadGeyserConfig = async () => {
    if (!drn) return;
    try {
      const cfg = await geyserAPI.getConfig(drn);
      setGeyserConfig(cfg);
      setSchedules(cfg.schedules || []);
      setTimerHours(cfg.timer?.hours || 0);
      setTimerMinutes(cfg.timer?.minutes || 0);
      setTimerActive(!!cfg.timer?.active);
      setTimerStartedAt(cfg.timer?.started_at || null);
    } catch (e) {
      setGeyserConfig(null);
    }
  };

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

  const handleStartTimer = async () => {
    if (timerHours === 0 && timerMinutes === 0) {
      setMessage({ type: "error", text: "Set timer duration first" });
      return;
    }
    setLoading(true);
    try {
      await geyserAPI.setTimer(drn, timerHours, timerMinutes, "start");
      setTimerActive(true);
      setTimerStartedAt(new Date().toISOString());
      setMessage({ type: "success", text: `Timer started: geyser will run for ${timerHours}h ${timerMinutes}m` });
      loadGeyserConfig();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to start timer" });
    }
    setLoading(false);
  };

  const handleStopTimer = async () => {
    setLoading(true);
    try {
      await geyserAPI.setTimer(drn, 0, 0, "stop");
      setTimerActive(false);
      setMessage({ type: "success", text: "Timer stopped" });
      loadGeyserConfig();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to stop timer" });
    }
    setLoading(false);
  };

  const handleAddSchedule = async () => {
    setScheduleLoading(true);
    setMessage(null);
    try {
      await geyserAPI.createSchedule(drn, {
        start_hour: newStartHour,
        start_minute: newStartMin,
        end_hour: newEndHour,
        end_minute: newEndMin,
        days: newDays,
      });
      setMessage({ type: "success", text: "Schedule added and synced to meter" });
      loadGeyserConfig();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to create schedule" });
    }
    setScheduleLoading(false);
  };

  const handleDeleteSchedule = async (id) => {
    setScheduleLoading(true);
    try {
      await geyserAPI.deleteSchedule(drn, id);
      setMessage({ type: "success", text: "Schedule removed" });
      loadGeyserConfig();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to delete schedule" });
    }
    setScheduleLoading(false);
  };

  const toggleDay = (idx) => {
    const updated = [...newDays];
    updated[idx] = updated[idx] ? 0 : 1;
    setNewDays(updated);
  };

  const pad = (n) => String(n).padStart(2, "0");
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Geyser Control</Typography>
        <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
          Manage your geyser power, timer, and schedules
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
        <Tab label="Timer" icon={<TimerRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
        <Tab label="Schedule" icon={<ScheduleRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" />
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2,
              bgcolor: timerActive ? "rgba(59,130,246,0.1)" : "rgba(100,116,139,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <TimerRoundedIcon sx={{ fontSize: 26, color: timerActive ? "#3b82f6" : "#64748b" }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Geyser Timer
              </Typography>
              <Chip
                label={timerActive ? "RUNNING" : "INACTIVE"} size="small"
                sx={{
                  mt: 0.5, fontWeight: 600, fontSize: 11,
                  bgcolor: timerActive ? "rgba(59,130,246,0.1)" : "rgba(100,116,139,0.1)",
                  color: timerActive ? "#3b82f6" : "#64748b",
                }}
              />
            </Box>
          </Box>

          <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", mb: 3 }}>
            Set a timer to automatically turn the geyser ON for a specific duration.
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Hours</InputLabel>
                <Select value={timerHours} label="Hours" onChange={(e) => setTimerHours(e.target.value)} disabled={timerActive}>
                  {Array.from({ length: 13 }, (_, i) => (
                    <MenuItem key={i} value={i}>{i}h</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Minutes</InputLabel>
                <Select value={timerMinutes} label="Minutes" onChange={(e) => setTimerMinutes(e.target.value)} disabled={timerActive}>
                  {minutes.map(m => (
                    <MenuItem key={m} value={m}>{m}m</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", gap: 1, height: "100%" }}>
                {!timerActive ? (
                  <Button
                    fullWidth variant="contained" startIcon={<PlayArrowRoundedIcon />}
                    onClick={handleStartTimer} disabled={loading || (timerHours === 0 && timerMinutes === 0)}
                    sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" }, borderRadius: 2 }}
                  >
                    Start Timer
                  </Button>
                ) : (
                  <Button
                    fullWidth variant="contained" startIcon={<StopRoundedIcon />}
                    onClick={handleStopTimer} disabled={loading}
                    sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, borderRadius: 2 }}
                  >
                    Stop Timer
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          {timerActive && timerStartedAt && (
            <Paper sx={{
              p: 2, borderRadius: 2,
              bgcolor: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.05)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}>
              <Typography sx={{ fontSize: 13, color: isDark ? "#93c5fd" : "#2563eb" }}>
                Timer started at {new Date(timerStartedAt).toLocaleTimeString()} - Geyser will run for {timerHours}h {timerMinutes}m
              </Typography>
            </Paper>
          )}
        </Paper>
      )}

      {tab === 2 && (
        <Box>
          <Paper elevation={0} sx={{ ...cardSx, mb: 2 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 1, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Add New Schedule
            </Typography>
            <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", mb: 3 }}>
              Set times when the geyser should automatically turn ON and OFF.
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Start Hour</InputLabel>
                  <Select value={newStartHour} label="Start Hour" onChange={(e) => setNewStartHour(e.target.value)}>
                    {hours.map(h => <MenuItem key={h} value={h}>{pad(h)}:00</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Start Min</InputLabel>
                  <Select value={newStartMin} label="Start Min" onChange={(e) => setNewStartMin(e.target.value)}>
                    {minutes.map(m => <MenuItem key={m} value={m}>:{pad(m)}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>End Hour</InputLabel>
                  <Select value={newEndHour} label="End Hour" onChange={(e) => setNewEndHour(e.target.value)}>
                    {hours.map(h => <MenuItem key={h} value={h}>{pad(h)}:00</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>End Min</InputLabel>
                  <Select value={newEndMin} label="End Min" onChange={(e) => setNewEndMin(e.target.value)}>
                    {minutes.map(m => <MenuItem key={m} value={m}>:{pad(m)}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 1, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Active Days
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
              {DAYS.map((day, idx) => (
                <Chip
                  key={day}
                  label={day}
                  size="small"
                  onClick={() => toggleDay(idx)}
                  sx={{
                    fontWeight: 600, fontSize: 12, cursor: "pointer",
                    bgcolor: newDays[idx] ? "rgba(59,130,246,0.15)" : (isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"),
                    color: newDays[idx] ? "#3b82f6" : (isDark ? "#64748b" : "#94a3b8"),
                    border: `1px solid ${newDays[idx] ? "rgba(59,130,246,0.3)" : "transparent"}`,
                  }}
                />
              ))}
            </Box>

            <Button
              variant="contained" startIcon={scheduleLoading ? <CircularProgress size={16} color="inherit" /> : <AddRoundedIcon />}
              onClick={handleAddSchedule} disabled={scheduleLoading}
              sx={{ bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" }, borderRadius: 2 }}
            >
              Add Schedule
            </Button>
          </Paper>

          <Paper elevation={0} sx={cardSx}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Active Schedules
            </Typography>
            {schedules.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: isDark ? "#475569" : "#94a3b8" }}>
                No schedules set. Add one above to automate your geyser.
              </Typography>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {schedules.map((s) => (
                  <Paper key={s.id} sx={{
                    p: 2, borderRadius: 2,
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <ScheduleRoundedIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
                        <Typography sx={{ fontSize: 15, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                          {pad(s.start_hour)}:{pad(s.start_minute)} - {pad(s.end_hour)}:{pad(s.end_minute)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {DAYS.map((day, idx) => (
                          <Chip
                            key={day} label={day} size="small"
                            sx={{
                              height: 22, fontSize: 10, fontWeight: 600,
                              bgcolor: (Array.isArray(s.days) ? s.days[idx] : false)
                                ? "rgba(59,130,246,0.15)" : (isDark ? "rgba(255,255,255,0.03)" : "#f1f5f9"),
                              color: (Array.isArray(s.days) ? s.days[idx] : false)
                                ? "#3b82f6" : (isDark ? "#475569" : "#cbd5e1"),
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <IconButton
                      size="small" onClick={() => handleDeleteSchedule(s.id)}
                      sx={{ color: "#ef4444", "&:hover": { bgcolor: "rgba(239,68,68,0.1)" } }}
                    >
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default GeyserControl;
