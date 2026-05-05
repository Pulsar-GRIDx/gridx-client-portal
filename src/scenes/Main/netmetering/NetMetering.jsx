import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, Grid, Chip, CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { netMeteringAPI, meterDataAPI } from "../../../services/api";
import Chart from "react-apexcharts";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ElectricBoltRoundedIcon from "@mui/icons-material/ElectricBoltRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

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

function whToKwh(val) {
  const n = parseFloat(val || 0);
  return isNaN(n) ? 0 : n / 1000;
}

function NetMetering() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";

  const [latest, setLatest] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [powerInfo, setPowerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!drn) return;
    setLoading(true);
    Promise.allSettled([
      netMeteringAPI.getLatest(drn).then(d => setLatest(d?.data || d)),
      netMeteringAPI.getSummary(drn).then(d => setSummary(d?.data || d)),
      netMeteringAPI.getHistory(drn, 100).then(d => {
        const arr = Array.isArray(d) ? d : d?.data || [];
        setHistory(arr);
      }),
      meterDataAPI.getPower(drn).then(d => setPowerInfo(d)),
    ]).finally(() => setLoading(false));
  }, [drn]);

  const importKwh = whToKwh(latest?.import_energy_wh);
  const exportKwh = whToKwh(latest?.export_energy_wh);
  const netKwh = whToKwh(latest?.net_energy_wh);
  const isExporting = exportKwh > importKwh;

  const currentPower = parseFloat(powerInfo?.active_power || 0).toFixed(1);
  const voltage = parseFloat(powerInfo?.voltage || 0).toFixed(1);

  const hourlyMap = {};
  history.forEach(h => {
    const dt = new Date(h.created_at);
    const key = `${String(dt.getHours()).padStart(2, "0")}:00`;
    if (!hourlyMap[key]) {
      hourlyMap[key] = { imports: [], exports: [] };
    }
    hourlyMap[key].imports.push(parseFloat(h.import_energy_wh || 0));
    hourlyMap[key].exports.push(parseFloat(h.export_energy_wh || 0));
  });

  const hourKeys = Object.keys(hourlyMap).sort();
  const historyChart = hourKeys.map(key => {
    const imp = hourlyMap[key].imports;
    const exp = hourlyMap[key].exports;
    const impDelta = imp.length > 1 ? (Math.max(...imp) - Math.min(...imp)) / 1000 : 0;
    const expDelta = exp.length > 1 ? (Math.max(...exp) - Math.min(...exp)) / 1000 : 0;
    return { x: key, import: parseFloat(impDelta.toFixed(3)), export: parseFloat(expDelta.toFixed(3)) };
  });

  const totalImportKwh = whToKwh(summary?.total_import_wh).toFixed(2);
  const totalExportKwh = whToKwh(summary?.total_export_wh).toFixed(2);
  const totalNetKwh = whToKwh(summary?.total_net_wh);
  const selfConsumedKwh = Math.max(0, parseFloat(totalExportKwh) - Math.abs(totalNetKwh)).toFixed(2);
  const readingCount = summary?.reading_count || 0;

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
    yaxis: {
      labels: {
        style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" },
        formatter: (v) => v.toFixed(2),
      },
      title: { text: "kWh", style: { color: isDark ? "#64748b" : "#94a3b8", fontSize: "11px" } },
    },
    grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (v) => v.toFixed(3) + " kWh" },
    },
    dataLabels: { enabled: false },
    legend: { labels: { colors: isDark ? "#94a3b8" : "#64748b" }, position: "top" },
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Net Metering</Typography>
          <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
            Energy import/export monitoring ({readingCount} readings today)
          </Typography>
        </Box>
        <Chip
          icon={isExporting ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
          label={isExporting ? "Net Exporter" : "Net Importer"}
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
          Current Status
        </Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={4}>
            <PowerFlowBox
              icon={<TrendingDownRoundedIcon />}
              label="Total Imported"
              value={importKwh.toFixed(2)}
              unit="kWh"
              color="#f97316"
              isDark={isDark}
            />
          </Grid>
          <Grid item xs={4}>
            <PowerFlowBox
              icon={<BoltRoundedIcon />}
              label="Active Power"
              value={currentPower}
              unit="W"
              color="#3b82f6"
              isDark={isDark}
            />
          </Grid>
          <Grid item xs={4}>
            <PowerFlowBox
              icon={<TrendingUpRoundedIcon />}
              label="Total Exported"
              value={exportKwh.toFixed(2)}
              unit="kWh"
              color="#22c55e"
              isDark={isDark}
            />
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
            {netKwh > 0 ? "+" : ""}{netKwh.toFixed(2)} <span style={{ fontSize: 14 }}>kWh</span>
          </Typography>
          <Typography sx={{ fontSize: 11, color: isDark ? "#475569" : "#94a3b8", mt: 0.5 }}>
            {isExporting ? "Exporting more than importing" : "Importing more than exporting"} | {voltage} V
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total Imported", val: totalImportKwh, unit: "kWh", color: "#f97316" },
          { label: "Total Exported", val: totalExportKwh, unit: "kWh", color: "#22c55e" },
          { label: "Net Balance", val: Math.abs(totalNetKwh).toFixed(2), unit: "kWh", color: isExporting ? "#22c55e" : "#f97316" },
          { label: "Readings", val: readingCount, unit: "total", color: "#3b82f6" },
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
          Hourly Import / Export
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
