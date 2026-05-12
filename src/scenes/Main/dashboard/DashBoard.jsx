import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Box, Typography, Paper, Grid, Chip, LinearProgress, IconButton, Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useData } from "../Data/getData";
import AuthContext from "../../../context/AuthContext";
import { meterDataAPI, vendingAPI, meterHealthAPI, netMeteringAPI } from "../../../services/api";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import ThermostatRoundedIcon from "@mui/icons-material/ThermostatRounded";
import PowerRoundedIcon from "@mui/icons-material/PowerRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import BatteryChargingFullRoundedIcon from "@mui/icons-material/BatteryChargingFullRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import ElectricMeterRoundedIcon from "@mui/icons-material/ElectricMeterRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import Chart from "react-apexcharts";

const IMPORT_RATE = 2.45;
const EXPORT_RATE = 1.60;
const POLL_INTERVAL = 10000;

const flowKeyframes = `
@keyframes flowRight {
  0% { transform: translateX(-100%); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateX(400%); opacity: 0; }
}
@keyframes flowLeft {
  0% { transform: translateX(400%); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { transform: translateX(-100%); opacity: 0; }
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}
`;

function PowerFlowAnimation({ activePower, isDark }) {
  const ap = parseFloat(activePower || 0);
  const isNeutral = ap === 0;
  const isExporting = ap < 0;
  const pw = Math.abs(ap);
  const color = isNeutral ? (isDark ? "#475569" : "#94a3b8") : isExporting ? "#22c55e" : "#f97316";
  const direction = isNeutral ? "Idle" : isExporting ? "Home to Grid" : "Grid to Home";
  const anim = isExporting ? "flowLeft" : "flowRight";
  const speed = pw > 500 ? 1.2 : pw > 100 ? 1.8 : 2.5;

  return (
    <Box sx={{ textAlign: "center" }}>
      <style>{flowKeyframes}</style>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color, mb: 1.5, letterSpacing: 1 }}>
        {direction.toUpperCase()}
      </Typography>
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: { xs: 1, sm: 3 }, px: 2,
      }}>
        <Box sx={{ textAlign: "center", minWidth: 70 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: "50%", mx: "auto", mb: 0.5,
            bgcolor: isNeutral ? (isDark ? "rgba(71,85,105,0.15)" : "rgba(148,163,184,0.1)") : isExporting ? "rgba(34,197,94,0.1)" : "rgba(59,130,246,0.1)",
            border: `2px solid ${isNeutral ? (isDark ? "rgba(71,85,105,0.3)" : "rgba(148,163,184,0.3)") : isExporting ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.3)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: isNeutral ? "none" : "pulseGlow 2s ease-in-out infinite",
          }}>
            <Typography sx={{ fontSize: 22 }}>{isExporting ? "\u{1F3E0}" : "⚡"}</Typography>
          </Box>
          <Typography sx={{ fontSize: 10, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600 }}>
            {isExporting ? "HOME" : "GRID"}
          </Typography>
        </Box>

        <Box sx={{
          flex: 1, maxWidth: 260, height: 32, position: "relative", overflow: "hidden",
          borderRadius: 16, bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}>
          {!isNeutral && [0, 1, 2, 3].map(i => (
            <Box key={i} sx={{
              position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)",
              width: 18, height: 18, borderRadius: "50%",
              bgcolor: color, boxShadow: `0 0 12px ${color}`,
              animation: `${anim} ${speed}s linear infinite`,
              animationDelay: `${i * speed / 4}s`,
            }} />
          ))}
          <Box sx={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            fontSize: 10, fontWeight: 700, color, bgcolor: isDark ? "#0f172a" : "#fff",
            px: 1, py: 0.2, borderRadius: 4, zIndex: 1, whiteSpace: "nowrap",
          }}>
            {isNeutral ? "0 W" : `${pw.toFixed(0)} W`}
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", minWidth: 70 }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: "50%", mx: "auto", mb: 0.5,
            bgcolor: isNeutral ? (isDark ? "rgba(71,85,105,0.15)" : "rgba(148,163,184,0.1)") : isExporting ? "rgba(59,130,246,0.1)" : "rgba(249,115,22,0.1)",
            border: `2px solid ${isNeutral ? (isDark ? "rgba(71,85,105,0.3)" : "rgba(148,163,184,0.3)") : isExporting ? "rgba(59,130,246,0.3)" : "rgba(249,115,22,0.3)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: isNeutral ? "none" : "pulseGlow 2s ease-in-out infinite",
            animationDelay: "1s",
          }}>
            <Typography sx={{ fontSize: 22 }}>{isExporting ? "⚡" : "\u{1F3E0}"}</Typography>
          </Box>
          <Typography sx={{ fontSize: 10, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 600 }}>
            {isExporting ? "GRID" : "HOME"}
          </Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: 11, color: isDark ? "#475569" : "#94a3b8", mt: 1.5 }}>
        {isNeutral ? "No active power flow" : isExporting ? "Solar generation exceeds consumption" : "Consuming power from the grid"}
      </Typography>
    </Box>
  );
}

function EnergySummaryCard({ title, totals, isDark }) {
  const subColor = isDark ? "#94a3b8" : "#64748b";
  const headerColor = isDark ? "#e2e8f0" : "#1e293b";
  const hasData = totals.importKwh > 0 || totals.exportKwh > 0;
  const totalKwh = totals.importKwh + totals.exportKwh;
  const importPct = totalKwh > 0 ? (totals.importKwh / totalKwh) * 100 : 50;
  const exportPct = totalKwh > 0 ? (totals.exportKwh / totalKwh) * 100 : 50;
  const isCredit = totals.netCost < 0;

  const donutOpts = {
    chart: { type: "donut", background: "transparent" },
    colors: ["#f97316", "#22c55e"],
    labels: ["Imported", "Exported"],
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: { show: true, fontSize: "11px", color: subColor, offsetY: -4 },
            value: { show: true, fontSize: "18px", fontWeight: 700, color: headerColor, offsetY: 4, formatter: () => `N$ ${Math.abs(totals.netCost).toFixed(2)}` },
            total: {
              show: true, label: isCredit ? "Credit" : "Net Cost",
              fontSize: "10px", color: isCredit ? "#22c55e" : "#f97316",
              formatter: () => `N$ ${Math.abs(totals.netCost).toFixed(2)}`,
            },
          },
        },
      },
    },
    stroke: { width: 2, colors: [isDark ? "#1e293b" : "#fff"] },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (v) => v.toFixed(3) + " kWh" },
    },
  };

  const donutSeries = hasData ? [totals.importKwh, totals.exportKwh] : [0.001, 0.001];

  return (
    <Paper elevation={0} sx={{
      p: 2.5, borderRadius: 3, height: "100%",
      bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
    }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1, color: headerColor, textAlign: "center" }}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        <Chart type="donut" width={200} height={200} options={donutOpts} series={donutSeries} />
      </Box>

      <Box sx={{
        display: "flex", justifyContent: "center", gap: 2, mb: 2,
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f97316" }} />
          <Typography sx={{ fontSize: 10, color: subColor }}>Import {importPct.toFixed(0)}%</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#22c55e" }} />
          <Typography sx={{ fontSize: 10, color: subColor }}>Export {exportPct.toFixed(0)}%</Typography>
        </Box>
      </Box>

      {[
        { label: "Import", val: `${totals.importKwh.toFixed(3)} kWh`, color: "#f97316" },
        { label: "Import Cost", val: `N$ ${totals.importCost.toFixed(2)}`, color: "#f97316" },
        { label: "Export", val: `${totals.exportKwh.toFixed(3)} kWh`, color: "#22c55e" },
        { label: "Export Credit", val: `N$ ${totals.exportCost.toFixed(2)}`, color: "#22c55e" },
        { label: "Net Cost", val: `${isCredit ? "-" : ""}N$ ${Math.abs(totals.netCost).toFixed(2)}`, color: isCredit ? "#22c55e" : "#f97316", bold: true },
      ].map((item, i) => (
        <Box key={i} sx={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          py: 0.8, borderBottom: i < 4 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}` : "none",
        }}>
          <Typography sx={{ fontSize: 12, color: subColor }}>{item.label}</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: item.bold ? 700 : 600, color: item.color }}>
            {item.val}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

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
  const [netLatest, setNetLatest] = useState(null);
  const [netHourly, setNetHourly] = useState(null);
  const [netDaily, setNetDaily] = useState(null);
  const [livePower, setLivePower] = useState(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!drn) return;
    vendingAPI.getTariffInfo(drn).then(d => setTariffInfo(d)).catch(() => {});
    meterHealthAPI.getLatest(drn).then(d => setHealthData(d?.data || d)).catch(() => {});
    meterDataAPI.getLocation(drn).then(d => setLocation(d?.data || d)).catch(() => {});
    netMeteringAPI.getLatest(drn).then(d => setNetLatest(d?.data || d)).catch(() => {});
    netMeteringAPI.getHourly(drn).then(d => setNetHourly(d?.data || d)).catch(() => {});
    netMeteringAPI.getDaily(drn, 400).then(d => setNetDaily(d?.data || d)).catch(() => {});
    meterDataAPI.getPower(drn).then(d => setLivePower(d)).catch(() => {});
  }, [drn]);

  useEffect(() => {
    if (!drn) return;
    pollRef.current = setInterval(() => {
      meterDataAPI.getPower(drn).then(d => setLivePower(d)).catch(() => {});
    }, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
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

      {/* LIVE POWER FLOW */}
      {(() => {
        const lp = parseFloat(livePower?.active_power || powerData?.active_energy || powerData?.Power || 0);
        const isExp = lp < 0;
        const isNeutral = lp === 0;
        const importWh = parseFloat(netLatest?.import_energy_wh || 0);
        const exportWh = parseFloat(netLatest?.export_energy_wh || 0);

        const subColor = isDark ? "#94a3b8" : "#64748b";
        const cardBg = isDark ? "rgba(30,41,59,0.6)" : "#fff";
        const cardBorder = `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`;
        const headerColor = isDark ? "#e2e8f0" : "#1e293b";
        const rowAlt = isDark ? "rgba(255,255,255,0.02)" : "#f8fafc";

        const statusColor = isNeutral ? (isDark ? "#475569" : "#94a3b8") : isExp ? "#22c55e" : "#f97316";
        const statusLabel = isNeutral ? "Idle" : isExp ? "Exporting" : "Importing";
        const StatusIcon = isNeutral ? BoltRoundedIcon : isExp ? TrendingUpRoundedIcon : TrendingDownRoundedIcon;

        const hourlyRows = (() => {
          if (!netHourly?.hourly) return [];
          return netHourly.hourly
            .filter(h => h.import > 0 || h.export > 0)
            .map(h => {
              const impKwh = h.import / 1000;
              const expKwh = h.export / 1000;
              return {
                hour: `${String(h.hour).padStart(2, "0")}:00`,
                importKwh: impKwh,
                importCost: impKwh * IMPORT_RATE,
                exportKwh: expKwh,
                exportCost: expKwh * EXPORT_RATE,
                netCost: (impKwh * IMPORT_RATE) - (expKwh * EXPORT_RATE),
              };
            });
        })();

        const dayTotals = hourlyRows.reduce((acc, r) => ({
          importKwh: acc.importKwh + r.importKwh,
          importCost: acc.importCost + r.importCost,
          exportKwh: acc.exportKwh + r.exportKwh,
          exportCost: acc.exportCost + r.exportCost,
          netCost: acc.netCost + r.netCost,
        }), { importKwh: 0, importCost: 0, exportKwh: 0, exportCost: 0, netCost: 0 });

        const monthTotals = (() => {
          const rows = netDaily?.history || [];
          const now = new Date();
          const thisMonth = now.getMonth();
          const thisYear = now.getFullYear();
          return rows
            .filter(r => { const d = new Date(r.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; })
            .reduce((acc, r) => {
              const ik = r.import / 1000;
              const ek = r.export / 1000;
              return {
                importKwh: acc.importKwh + ik,
                importCost: acc.importCost + ik * IMPORT_RATE,
                exportKwh: acc.exportKwh + ek,
                exportCost: acc.exportCost + ek * EXPORT_RATE,
                netCost: acc.netCost + (ik * IMPORT_RATE - ek * EXPORT_RATE),
              };
            }, { importKwh: 0, importCost: 0, exportKwh: 0, exportCost: 0, netCost: 0 });
        })();

        return (
          <>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 3, bgcolor: cardBg, border: cardBorder }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <SolarPowerRoundedIcon sx={{ fontSize: 18, color: isDark ? "#60a5fa" : "#2563eb" }} />
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: headerColor }}>
                  Live Power Flow
                </Typography>
                <Chip
                  size="small"
                  icon={<StatusIcon />}
                  label={statusLabel}
                  sx={{
                    ml: "auto", fontWeight: 600, fontSize: 11,
                    bgcolor: `${statusColor}18`,
                    color: statusColor,
                    border: `1px solid ${statusColor}30`,
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              </Box>
              <Box sx={{
                p: 3, borderRadius: 3,
                bgcolor: isDark ? "rgba(255,255,255,0.02)" : "#f8fafc",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}`,
              }}>
                <PowerFlowAnimation activePower={lp} isDark={isDark} />
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: "center", p: 1.5, borderRadius: 2, bgcolor: isDark ? "rgba(249,115,22,0.06)" : "rgba(249,115,22,0.04)" }}>
                    <Typography sx={{ fontSize: 10, color: subColor, mb: 0.3 }}>Imported</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#f97316" }}>
                      {(importWh / 1000).toFixed(2)} <span style={{ fontSize: 10, fontWeight: 400 }}>kWh</span>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: "center", p: 1.5, borderRadius: 2, bgcolor: isDark ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.04)" }}>
                    <Typography sx={{ fontSize: 10, color: subColor, mb: 0.3 }}>Active Power</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#3b82f6" }}>
                      {lp.toFixed(1)} <span style={{ fontSize: 10, fontWeight: 400 }}>W</span>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: "center", p: 1.5, borderRadius: 2, bgcolor: isDark ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.04)" }}>
                    <Typography sx={{ fontSize: 10, color: subColor, mb: 0.3 }}>Exported</Typography>
                    <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#22c55e" }}>
                      {(exportWh / 1000).toFixed(2)} <span style={{ fontSize: 10, fontWeight: 400 }}>kWh</span>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* TODAY & THIS MONTH SUMMARY CARDS WITH DONUT CHARTS */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <EnergySummaryCard title="Today" totals={dayTotals} isDark={isDark} />
              </Grid>
              <Grid item xs={12} md={6}>
                <EnergySummaryCard
                  title={`${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`}
                  totals={monthTotals}
                  isDark={isDark}
                />
              </Grid>
            </Grid>

            {/* HOURLY IMPORT/EXPORT BAR CHART */}
            {hourlyRows.length > 0 && (
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 3, bgcolor: cardBg, border: cardBorder }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: headerColor }}>
                  Hourly Import vs Export
                </Typography>
                <Chart
                  type="bar" height={300}
                  options={{
                    chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
                    colors: ["#f97316", "#22c55e"],
                    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
                    xaxis: {
                      categories: hourlyRows.map(r => r.hour),
                      labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" }, rotate: -45 },
                      axisBorder: { show: false }, axisTicks: { show: false },
                    },
                    yaxis: {
                      labels: {
                        style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" },
                        formatter: (v) => v.toFixed(3),
                      },
                      title: { text: "kWh", style: { color: isDark ? "#64748b" : "#94a3b8", fontSize: "11px" } },
                    },
                    grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
                    tooltip: { theme: isDark ? "dark" : "light", y: { formatter: (v) => v.toFixed(3) + " kWh" } },
                    dataLabels: { enabled: false },
                    legend: { labels: { colors: isDark ? "#94a3b8" : "#64748b" }, position: "top" },
                  }}
                  series={[
                    { name: "Imported (kWh)", data: hourlyRows.map(r => parseFloat(r.importKwh.toFixed(3))) },
                    { name: "Exported (kWh)", data: hourlyRows.map(r => parseFloat(r.exportKwh.toFixed(3))) },
                  ]}
                />
              </Paper>
            )}

            {/* TODAY'S HOURLY IMPORT/EXPORT COST */}
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, mb: 3, bgcolor: cardBg, border: cardBorder }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: headerColor }}>
                Today's Hourly Breakdown
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <Box component="table" sx={{
                  width: "100%", borderCollapse: "collapse", fontSize: 12,
                  "& th": { textAlign: "left", py: 1, px: 1.5, color: subColor, fontWeight: 600, fontSize: 11, borderBottom: `2px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}` },
                  "& td": { py: 1, px: 1.5, color: isDark ? "#e2e8f0" : "#1e293b", fontSize: 12, borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}` },
                }}>
                  <thead>
                    <tr>
                      <th>Hour</th>
                      <th style={{ textAlign: "right" }}>Import (kWh)</th>
                      <th style={{ textAlign: "right" }}>Import Cost (N$)</th>
                      <th style={{ textAlign: "right" }}>Export (kWh)</th>
                      <th style={{ textAlign: "right" }}>Export Credit (N$)</th>
                      <th style={{ textAlign: "right" }}>Net Cost (N$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourlyRows.length > 0 ? hourlyRows.map((r, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? rowAlt : "transparent" }}>
                        <td style={{ fontFamily: "monospace" }}>{r.hour}</td>
                        <td style={{ textAlign: "right", color: "#f97316", fontWeight: 600 }}>{r.importKwh.toFixed(3)}</td>
                        <td style={{ textAlign: "right", color: "#f97316" }}>{r.importCost.toFixed(2)}</td>
                        <td style={{ textAlign: "right", color: "#22c55e", fontWeight: 600 }}>{r.exportKwh.toFixed(3)}</td>
                        <td style={{ textAlign: "right", color: "#22c55e" }}>{r.exportCost.toFixed(2)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: r.netCost > 0 ? "#f97316" : "#22c55e" }}>
                          {r.netCost > 0 ? "" : "-"}{Math.abs(r.netCost).toFixed(2)}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={6} style={{ textAlign: "center", color: subColor, py: 20 }}>No hourly data yet today</td></tr>
                    )}
                    {hourlyRows.length > 0 && (
                      <tr style={{ background: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.04)" }}>
                        <td style={{ fontWeight: 700 }}>Total</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#f97316" }}>{dayTotals.importKwh.toFixed(3)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#f97316" }}>{dayTotals.importCost.toFixed(2)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#22c55e" }}>{dayTotals.exportKwh.toFixed(3)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: "#22c55e" }}>{dayTotals.exportCost.toFixed(2)}</td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: dayTotals.netCost > 0 ? "#f97316" : "#22c55e" }}>
                          {dayTotals.netCost > 0 ? "" : "-"}{Math.abs(dayTotals.netCost).toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Box>
              </Box>
            </Paper>
          </>
        );
      })()}

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
