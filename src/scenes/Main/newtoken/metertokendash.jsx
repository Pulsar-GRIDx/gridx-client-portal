import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Switch, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { meterDataAPI, meterControlAPI } from "../../../services/api";
import SendToken from "./components/sendtoken";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";

function ControlCard({ title, icon, controlType, drn, isDark }) {
  const [state, setState] = useState("0");
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!drn) return;
    const getFn = controlType === "heater" ? meterDataAPI.getHeaterState : meterDataAPI.getMainsState;
    getFn(drn).then(d => { setState(String(d)); setChecked(d === "1" || d === 1); }).catch(() => {});
  }, [drn, controlType]);

  const isOn = state === "1";
  const color = isOn ? "#22c55e" : "#ef4444";

  const handleToggle = async () => {
    setDialogOpen(false);
    if (!drn) return;
    setLoading(true);
    const newState = checked ? 1 : 0;
    try {
      const setFn = controlType === "heater" ? meterControlAPI.setHeaterControl : meterControlAPI.setMainsControl;
      await setFn(drn, newState, "Customer Portal");
      setState(String(newState));
      setChecked(newState === 1);
    } catch (e) {
      console.error("Toggle error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={0} sx={{
      p: 2.5, borderRadius: 3, height: "100%",
      bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box sx={{
          width: 42, height: 42, borderRadius: 2,
          bgcolor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${color}30`,
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
        </Box>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{title}</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color }}>{isOn ? "ON" : "OFF"}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>Off</Typography>
          <Switch
            checked={checked}
            onChange={() => setChecked(!checked)}
            size="small"
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#22c55e" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#22c55e" },
            }}
          />
          <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>On</Typography>
        </Box>
        <Button
          variant="contained" size="small"
          disabled={loading}
          onClick={() => setDialogOpen(true)}
          sx={{
            textTransform: "none", fontSize: 12, fontWeight: 600, px: 2.5, py: 0.7,
            borderRadius: 2, bgcolor: isDark ? "#2563eb" : "#3b82f6",
            "&:hover": { bgcolor: isDark ? "#1d4ed8" : "#2563eb" },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to turn {title.toLowerCase()} {checked ? "on" : "off"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleToggle} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

const Metertokendash = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || (() => {
    try { return JSON.parse(sessionStorage.getItem("user") || "{}").DRN || ""; } catch { return ""; }
  })();

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Meter Control</Typography>
        <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
          Token entry and device controls
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <SendToken drn={drn} />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ControlCard title="Mains" icon={<HomeRoundedIcon />} controlType="mains" drn={drn} isDark={isDark} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ControlCard title="Geyser" icon={<LocalFireDepartmentRoundedIcon />} controlType="heater" drn={drn} isDark={isDark} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Metertokendash;
