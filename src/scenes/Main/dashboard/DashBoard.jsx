import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, Grid, Chip, LinearProgress, IconButton, Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useData } from "../Data/getData";
import AuthContext from "../../../context/AuthContext";
import { meterDataAPI, vendingAPI, meterHealthAPI } from "../../../services/api";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import ElectricMeterRoundedIcon from "@mui/icons-material/ElectricMeterRounded";
import Chart from "react-apexcharts";

function StatCard({ title, value, unit, icon, color, subtitle, isDark }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5, borderRadius: 3, height: "100%",
        bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
        transition: "all 0.2s",
        "&:hover": { transform: "translateY(-2px)", boxShadow: isDark ? "0 8px 25px rgba(0,0,0,0.3)" : "0 8px 25px rgba(0,0,0,0.08)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 500, mb: 0.5 }}>
            {title}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography sx={{ fontSize: 28, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", lineHeight: 1.2 }}>
              {value}
            </Typography>
            {unit && <Typography sx={{ fontSize: 13, color: isDark ? "#64748b" : "#94a3b8", fontWeight: 500 }}>{unit}</Typography>}
          </Box>
          {subtitle && (
            <Typography sx={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{
          width: 42, height: 42, borderRadius: 2,
          bgcolor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
        </Box>
      </Box>
    </Paper>
  );
}

function EnergyBar({ value, max = 5000, isDark }) {
  const pct = Math.min((value / max) * 100, 100);
  const getColor = (p) => {
    if (p <= 20) return "#ef4444";
    if (p <= 50) return "#f97316";
    if (p <= 75) return "#eab308";
    return "#22c55e";
  };
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>Energy Balance</Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: getColor(pct) }}>{value} kWh</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 8, borderRadius: 4, bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
          "& .MuiLinearProgress-bar": { borderRadius: 4, bgcolor: getColor(pct) },
        }}
      />
    </Box>
  );
}

function Dashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { unitsData, averageUnitsData, loadData, powerData, hourlyData, signalStrengthData } = useData();
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";

  const [tariffInfo, setTariffInfo] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [location, setLocation] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!drn) return;
    vendingAPI.getTariffInfo(drn).then(d => setTariffInfo(d)).catch(() => {});
    meterHealthAPI.getLatest(drn).then(d => setHealthData(d?.data || d)).catch(() => {});
    meterDataAPI.getLocation(drn).then(d => setLocation(d?.data || d)).catch(() => {});
  }, [drn]);

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  const fmt = (v, d = 1) => { const n = parseFloat(v); return isNaN(n) ? "---" : n.toFixed(d); };
  const voltage = fmt(powerData?.voltage || powerData?.Voltage);
  const current = fmt(powerData?.current || powerData?.Current, 2);
  const power = fmt(powerData?.power || powerData?.active_energy || powerData?.Power);
  const frequency = fmt((powerData?.frequency || powerData?.Frequency || 0) * 100, 1);

  const mainsState = String(loadData?.mains_state) === "1";
  const geyserState = String(loadData?.geyser_state) === "1";

  const todayUsage = Array.isArray(hourlyData)
    ? hourlyData.reduce((sum, h) => sum + (parseFloat(h.kWh) || 0), 0).toFixed(2)
    : (averageUnitsData || "0");

  const chartData = Array.isArray(hourlyData)
    ? hourlyData.filter(d => (parseFloat(d.kWh) || 0) > 0).map(d => ({
        x: d.hour || d.Hour || "",
        y: parseFloat(d.kWh || d.energy || d.Energy || 0),
      }))
    : [];

  const chartOpts = {
    chart: { type: "area", toolbar: { show: false }, sparkline: { enabled: false }, background: "transparent" },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
    colors: ["#3b82f6"],
    xaxis: {
      categories: chartData.map(d => d.x),
      labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" },
        formatter: (v) => v.toFixed(2),
      },
    },
    grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: isDark ? "dark" : "light", y: { formatter: (v) => v.toFixed(3) + " kWh" } },
    dataLabels: { enabled: false },
  };

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>
            Dashboard
          </Typography>
          <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13 }}>
            Welcome back{userInfo?.FirstName ? `, ${userInfo.FirstName}` : ""}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Chip
            icon={<PowerRoundedIcon />}
            label={mainsState ? "Mains ON" : "Mains OFF"}
            size="small"
            sx={{
              fontWeight: 600, fontSize: 12,
              bgcolor: mainsState ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: mainsState ? "#22c55e" : "#ef4444",
              border: `1px solid ${mainsState ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
          <Chip
            icon={<WaterDropRoundedIcon />}
            label={geyserState ? "Heater ON" : "Heater OFF"}
            size="small"
            sx={{
              fontWeight: 600, fontSize: 12,
              bgcolor: geyserState ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
              color: geyserState ? "#22c55e" : "#ef4444",
              border: `1px solid ${geyserState ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={handleRefresh} sx={{ color: isDark ? "#94a3b8" : "#64748b" }}>
              <RefreshRoundedIcon fontSize="small" sx={{ animation: refreshing ? "spin 1s linear infinite" : "none", "@keyframes spin": { "100%": { transform: "rotate(360deg)" } } }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title="Meter Units" value={unitsData || "0"} unit="kWh" icon={<ElectricMeterRoundedIcon />} color="#3b82f6" isDark={isDark} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title="Today's Usage" value={todayUsage} unit="kWh" icon={<TrendingUpRoundedIcon />} color="#f97316" isDark={isDark} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title="Current Power" value={power} unit="W" icon={<BatteryChargingFullRoundedIcon />} color="#10b981" isDark={isDark} />
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <StatCard title="Voltage" value={voltage} unit="V" icon={<BoltRoundedIcon />} color="#8b5cf6" isDark={isDark} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3, height: "100%",
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Energy Consumption (Today)
            </Typography>
            {chartData.length > 0 ? (
              <Chart type="area" height={220} options={chartOpts} series={[{ name: "kWh", data: chartData.map(d => d.y) }]} />
            ) : (
              <Box sx={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: isDark ? "#475569" : "#94a3b8" }}>No consumption data yet today</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3, height: "100%",
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2.5, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Live Readings
            </Typography>
            {[
              { label: "Power", val: power, unit: "W", color: "#f97316" },
              { label: "Voltage", val: voltage, unit: "V", color: "#3b82f6" },
              { label: "Current", val: current, unit: "A", color: "#10b981" },
              { label: "Frequency", val: frequency, unit: "Hz", color: "#8b5cf6" },
              { label: "Signal", val: signalStrengthData ? `${signalStrengthData}` : "---", unit: "dBm", color: "#eab308" },
            ].map((item, i) => (
              <Box key={i} sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                py: 1.2, borderBottom: i < 4 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}` : "none",
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: item.color }} />
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                  {item.val} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>{item.unit}</span>
                </Typography>
              </Box>
            ))}

            <Box sx={{ mt: 2.5 }}>
              <EnergyBar value={parseFloat(unitsData) || 0} max={5000} isDark={isDark} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3,
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AccessTimeRoundedIcon sx={{ fontSize: 18, color: isDark ? "#60a5fa" : "#2563eb" }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Tariff Info
              </Typography>
            </Box>
            {tariffInfo ? (
              <Box>
                {[
                  { label: "Tariff Type", val: tariffInfo.tariff_type || tariffInfo.tariffType || "Standard" },
                  { label: "Rate", val: tariffInfo.rate ? `R ${tariffInfo.rate}/kWh` : "N/A" },
                  { label: "Period", val: tariffInfo.current_period || tariffInfo.period || "N/A" },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                    <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{item.val}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, color: isDark ? "#475569" : "#94a3b8" }}>Loading...</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3,
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <ThermostatRoundedIcon sx={{ fontSize: 18, color: isDark ? "#60a5fa" : "#2563eb" }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Meter Health
              </Typography>
            </Box>
            {healthData ? (
              <Box>
                {[
                  { label: "Temperature", val: healthData.temperature ? `${parseFloat(healthData.temperature).toFixed(1)}°C` : "N/A" },
                  { label: "Signal", val: healthData.signal_strength ? `${healthData.signal_strength}%` : "N/A" },
                  { label: "Uptime", val: healthData.uptime || "N/A" },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                    <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{item.val}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, color: isDark ? "#475569" : "#94a3b8" }}>Loading...</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={0} sx={{
            p: 2.5, borderRadius: 3,
            bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <LocationOnRoundedIcon sx={{ fontSize: 18, color: isDark ? "#60a5fa" : "#2563eb" }} />
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Location
              </Typography>
            </Box>
            {location ? (
              <Box>
                {[
                  { label: "Latitude", val: location.latitude || location.Latitude || "N/A" },
                  { label: "Longitude", val: location.longitude || location.Longitude || "N/A" },
                  { label: "Last Update", val: location.date_time ? new Date(location.date_time).toLocaleDateString() : "N/A" },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                    <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{item.val}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, color: isDark ? "#475569" : "#94a3b8" }}>Loading...</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
