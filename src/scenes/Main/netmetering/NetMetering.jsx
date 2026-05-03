import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, Grid, Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { netMeteringAPI } from "../../../services/api";
import Chart from "react-apexcharts";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";

function PowerFlowBox({ icon, label, value, unit, color, isDark }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{
        width: 64, height: 64, borderRadius: 3, mx: "auto", mb: 1,
        bgcolor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center",
        border: `2px solid ${color}30`,
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 30, color } })}
      </Box>
      <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mb: 0.3 }}>{label}</Typography>
      <Typography sx={{ fontSize: 20, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
        {value} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>{unit}</span>
      </Typography>
    </Box>
  );
}

function NetMetering() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";

  const [latest, setLatest] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!drn) return;
    netMeteringAPI.getLatest(drn).then(d => setLatest(d?.data || d)).catch(() => {});
    netMeteringAPI.getSummary(drn).then(d => setSummary(d?.data || d)).catch(() => {});
    netMeteringAPI.getHistory(drn, 30).then(d => {
      const arr = Array.isArray(d) ? d : d?.data || [];
      setHistory(arr);
    }).catch(() => {});
  }, [drn]);

  const solarPower = latest?.solar_power || latest?.solarPower || 0;
  const gridPower = latest?.grid_power || latest?.gridPower || 0;
  const homePower = latest?.home_power || latest?.homePower || latest?.load_power || 0;
  const netEnergy = latest?.net_energy || latest?.netEnergy || 0;
  const isExporting = netEnergy > 0;

  const historyChart = history.map(h => ({
    x: h.date || h.timestamp ? new Date(h.date || h.timestamp).toLocaleDateString("en", { month: "short", day: "numeric" }) : "",
    import: Math.abs(parseFloat(h.import_energy || h.imported || 0)),
    export: Math.abs(parseFloat(h.export_energy || h.exported || 0)),
  }));

  const cardSx = {
    p: 3, borderRadius: 3,
    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
  };

  const chartOpts = {
    chart: { type: "bar", toolbar: { show: false }, background: "transparent", stacked: false },
    colors: ["#f97316", "#22c55e"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
    xaxis: {
      categories: historyChart.map(d => d.x),
      labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" } } },
    grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: isDark ? "dark" : "light" },
    dataLabels: { enabled: false },
    legend: { labels: { colors: isDark ? "#94a3b8" : "#64748b" }, position: "top" },
  };

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Net Metering</Typography>
          <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
            Solar generation and grid exchange
          </Typography>
        </Box>
        <Chip
          icon={isExporting ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
          label={isExporting ? "Exporting" : "Importing"}
          sx={{
            fontWeight: 600, fontSize: 12,
            bgcolor: isExporting ? "rgba(34,197,94,0.1)" : "rgba(249,115,22,0.1)",
            color: isExporting ? "#22c55e" : "#f97316",
            border: `1px solid ${isExporting ? "rgba(34,197,94,0.2)" : "rgba(249,115,22,0.2)"}`,
            "& .MuiChip-icon": { color: "inherit" },
          }}
        />
      </Box>

      <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 3, color: isDark ? "#e2e8f0" : "#1e293b", textAlign: "center" }}>
          Power Flow
        </Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={4}>
            <PowerFlowBox icon={<SolarPowerRoundedIcon />} label="Solar" value={solarPower} unit="W" color="#eab308" isDark={isDark} />
          </Grid>
          <Grid item xs={4}>
            <PowerFlowBox icon={<HomeRoundedIcon />} label="Home" value={homePower} unit="W" color="#3b82f6" isDark={isDark} />
          </Grid>
          <Grid item xs={4}>
            <PowerFlowBox icon={<ElectricBoltRoundedIcon />} label="Grid" value={Math.abs(gridPower)} unit="W" color={isExporting ? "#22c55e" : "#f97316"} isDark={isDark} />
          </Grid>
        </Grid>

        <Box sx={{
          mt: 3, p: 2, borderRadius: 2, textAlign: "center",
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}`,
        }}>
          <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>Net Energy</Typography>
          <Typography sx={{
            fontSize: 28, fontWeight: 700,
            color: isExporting ? "#22c55e" : "#f97316",
          }}>
            {isExporting ? "+" : ""}{netEnergy} <span style={{ fontSize: 14 }}>kWh</span>
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summary && [
          { label: "Total Generated", val: summary.total_generated || summary.totalGenerated || "0", unit: "kWh", color: "#eab308" },
          { label: "Total Exported", val: summary.total_exported || summary.totalExported || "0", unit: "kWh", color: "#22c55e" },
          { label: "Total Imported", val: summary.total_imported || summary.totalImported || "0", unit: "kWh", color: "#f97316" },
          { label: "Self Consumed", val: summary.self_consumed || summary.selfConsumed || "0", unit: "kWh", color: "#3b82f6" },
        ].map((item, i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Paper elevation={0} sx={cardSx}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
                <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
                {item.val} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>{item.unit}</span>
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={cardSx}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
          Import / Export History (Last 30 Days)
        </Typography>
        {historyChart.length > 0 ? (
          <Chart
            type="bar" height={300}
            options={chartOpts}
            series={[
              { name: "Imported (kWh)", data: historyChart.map(d => d.import) },
              { name: "Exported (kWh)", data: historyChart.map(d => d.export) },
            ]}
          />
        ) : (
          <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: isDark ? "#475569" : "#94a3b8" }}>No history data available</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default NetMetering;
