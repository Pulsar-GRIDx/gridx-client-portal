import React, { useContext } from "react";
import { Box, Typography, Paper, Grid, Avatar, Divider } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useData } from "../Data/getData";
import AuthContext from "../../../context/AuthContext";
import ElectricMeterRoundedIcon from "@mui/icons-material/ElectricMeterRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";

function InfoRow({ label, value, isDark }) {
  return (
    <Box sx={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      py: 1.2, borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}`,
    }}>
      <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{value || "---"}</Typography>
    </Box>
  );
}

const ProfileDash = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userData, powerData, signalStrengthData, loadData } = useData();
  const { userInfo } = useContext(AuthContext);

  const user = userInfo || userData || {};
  const fullName = `${user.FirstName || ""} ${user.LastName || ""}`.trim() || "User";

  const fmt = (v, d = 1) => { const n = parseFloat(v); return isNaN(n) ? "---" : n.toFixed(d); };
  const voltage = fmt(powerData?.voltage || powerData?.Voltage);
  const current = fmt(powerData?.current || powerData?.Current, 2);
  const power = fmt(powerData?.power || powerData?.active_energy || powerData?.Power);
  const frequency = fmt((powerData?.frequency || powerData?.Frequency || 0) * 100, 1);
  const mainsState = String(loadData?.mains_state) === "1";
  const geyserState = String(loadData?.geyser_state) === "1";

  const cardSx = {
    p: 2.5, borderRadius: 3,
    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
  };

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Profile</Typography>
        <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
          Account and meter information
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5, flexWrap: "wrap" }}>
          <Avatar sx={{
            width: 56, height: 56, bgcolor: isDark ? "#1e3a5f" : "#dbeafe",
            color: isDark ? "#60a5fa" : "#2563eb", fontSize: 22, fontWeight: 700,
          }}>
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
              {fullName}
            </Typography>
            <Typography sx={{ fontSize: 13, color: isDark ? "#64748b" : "#94a3b8" }}>
              {user.Email || "---"}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2, borderColor: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0" }} />
        <InfoRow label="Email" value={user.Email} isDark={isDark} />
        <InfoRow label="Location" value={[user.countryName, user.cityName, user.streetName].filter(Boolean).join(", ")} isDark={isDark} />
        <InfoRow label="Meter Number (DRN)" value={user.DRN} isDark={isDark} />
        <InfoRow label="Profile ID" value={user.UserID} isDark={isDark} />
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Paper elevation={0} sx={{ ...cardSx, textAlign: "center", py: 2 }}>
            <BoltRoundedIcon sx={{ fontSize: 24, color: "#3b82f6", mb: 0.5 }} />
            <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b" }}>Voltage</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
              {voltage} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>V</span>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Paper elevation={0} sx={{ ...cardSx, textAlign: "center", py: 2 }}>
            <PowerRoundedIcon sx={{ fontSize: 24, color: "#f97316", mb: 0.5 }} />
            <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b" }}>Power</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
              {power} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>W</span>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Paper elevation={0} sx={{ ...cardSx, textAlign: "center", py: 2 }}>
            <SpeedRoundedIcon sx={{ fontSize: 24, color: "#10b981", mb: 0.5 }} />
            <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b" }}>Current</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
              {current} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>A</span>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Paper elevation={0} sx={{ ...cardSx, textAlign: "center", py: 2 }}>
            <SignalCellularAltRoundedIcon sx={{ fontSize: 24, color: "#8b5cf6", mb: 0.5 }} />
            <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b" }}>Signal</Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
              {signalStrengthData || "---"} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>dBm</span>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={cardSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <ElectricMeterRoundedIcon sx={{ fontSize: 18, color: isDark ? "#60a5fa" : "#2563eb" }} />
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Meter Status
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{
              p: 2, borderRadius: 2, textAlign: "center",
              bgcolor: mainsState ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${mainsState ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}>
              <PowerRoundedIcon sx={{ fontSize: 28, color: mainsState ? "#22c55e" : "#ef4444", mb: 0.5 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: mainsState ? "#22c55e" : "#ef4444" }}>
                Mains {mainsState ? "ON" : "OFF"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{
              p: 2, borderRadius: 2, textAlign: "center",
              bgcolor: geyserState ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${geyserState ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}>
              <WaterDropRoundedIcon sx={{ fontSize: 28, color: geyserState ? "#22c55e" : "#ef4444", mb: 0.5 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: geyserState ? "#22c55e" : "#ef4444" }}>
                Heater {geyserState ? "ON" : "OFF"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <InfoRow label="Frequency" value={`${frequency} Hz`} isDark={isDark} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ProfileDash;
