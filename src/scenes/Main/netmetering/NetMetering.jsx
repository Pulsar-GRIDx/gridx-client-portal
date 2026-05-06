import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, Grid, Chip, CircularProgress, Tabs, Tab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { netMeteringAPI, meterDataAPI } from "../../../services/api";
import Chart from "react-apexcharts";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

function PowerFlowBox({ icon, label, value, unit, color, isDark, sub }) {
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
      {sub && <Typography sx={{ fontSize: 10, color: isDark ? "#475569" : "#94a3b8", mt: 0.3 }}>{sub}</Typography>}
    </Box>
  );
}

function whToKwh(val) {
  const n = parseFloat(val || 0);
  return isNaN(n) ? 0 : n / 1000;
}

function formatTime(dateStr) {
  if (!dateStr) return "---";
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function NetMetering() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";

  const [tab, setTab] = useState(0);
  const [latest, setLatest] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [powerInfo, setPowerInfo] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
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
      netMeteringAPI.getHourly(drn).then(d => setHourlyData(d?.data || d)),
      netMeteringAPI.getDaily(drn, 30).then(d => setDailyData(d?.data || d)),
    ]).finally(() => setLoading(false));
  }, [drn]);

  const importKwh = whToKwh(latest?.import_energy_wh);
  const exportKwh = whToKwh(latest?.export_energy_wh);
  const netKwh = whToKwh(latest?.net_energy_wh);
  const isExporting = exportKwh > importKwh;

  const currentPower = parseFloat(powerInfo?.active_power || 0).toFixed(1);
  const voltage = parseFloat(powerInfo?.voltage || 0).toFixed(1);
  const current = parseFloat(powerInfo?.current || 0).toFixed(2);
  const frequency = (parseFloat(powerInfo?.frequency || 0) * 100).toFixed(1);

  const totalImportKwh = whToKwh(summary?.total_import_wh).toFixed(2);
  const totalExportKwh = whToKwh(summary?.total_export_wh).toFixed(2);
  const totalNetKwh = whToKwh(summary?.total_net_wh);
  const readingCount = summary?.reading_count || 0;

  const cardSx = {
    p: 3, borderRadius: 3,
    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
  };

  const tabSx = {
    textTransform: "none", fontWeight: 600, fontSize: 13, minHeight: 42,
    color: isDark ? "#94a3b8" : "#64748b",
    "&.Mui-selected": { color: isDark ? "#f1f5f9" : "#0f172a" },
  };

  // Hourly chart from history (fallback) or from /hourly endpoint
  const hourlyChartData = (() => {
    if (hourlyData?.hourly) {
      return hourlyData.hourly
        .filter(h => h.import > 0 || h.export > 0)
        .map(h => ({
          x: `${String(h.hour).padStart(2, "0")}:00`,
          import: parseFloat((h.import / 1000).toFixed(3)),
          export: parseFloat((h.export / 1000).toFixed(3)),
        }));
    }
    const hourlyMap = {};
    history.forEach(h => {
      const dt = new Date(h.created_at);
      const key = `${String(dt.getHours()).padStart(2, "0")}:00`;
      if (!hourlyMap[key]) hourlyMap[key] = { imports: [], exports: [] };
      hourlyMap[key].imports.push(parseFloat(h.import_energy_wh || 0));
      hourlyMap[key].exports.push(parseFloat(h.export_energy_wh || 0));
    });
    return Object.keys(hourlyMap).sort().map(key => {
      const imp = hourlyMap[key].imports;
      const exp = hourlyMap[key].exports;
      const impDelta = imp.length > 1 ? (Math.max(...imp) - Math.min(...imp)) / 1000 : 0;
      const expDelta = exp.length > 1 ? (Math.max(...exp) - Math.min(...exp)) / 1000 : 0;
      return { x: key, import: parseFloat(impDelta.toFixed(3)), export: parseFloat(expDelta.toFixed(3)) };
    });
  })();

  const makeBarChartOpts = (categories) => ({
    chart: { type: "bar", toolbar: { show: false }, background: "transparent", stacked: false },
    colors: ["#f97316", "#22c55e"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
    xaxis: {
      categories,
      labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" }, rotate: -45 },
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
    tooltip: { theme: isDark ? "dark" : "light", y: { formatter: (v) => v.toFixed(3) + " kWh" } },
    dataLabels: { enabled: false },
    legend: { labels: { colors: isDark ? "#94a3b8" : "#64748b" }, position: "top" },
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Net Metering</Typography>
          <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
            Energy import/export monitoring ({readingCount} readings)
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

      <Paper elevation={0} sx={{ ...cardSx, mb: 2, p: 0 }}>
        <Tabs
          value={tab} onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
            "& .MuiTabs-indicator": { bgcolor: "#3b82f6", height: 3 },
          }}
        >
          <Tab label="Overview" icon={<BoltRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" sx={tabSx} />
          <Tab label="Meter Readings" icon={<SpeedRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" sx={tabSx} />
          <Tab label="Daily History" icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" sx={tabSx} />
        </Tabs>
      </Paper>

      {/* TAB 0: OVERVIEW */}
      {tab === 0 && (
        <>
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 3, color: isDark ? "#e2e8f0" : "#1e293b", textAlign: "center" }}>
              Current Status
            </Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={4}>
                <PowerFlowBox icon={<TrendingDownRoundedIcon />} label="Total Imported" value={importKwh.toFixed(2)} unit="kWh" color="#f97316" isDark={isDark} />
              </Grid>
              <Grid item xs={4}>
                <PowerFlowBox icon={<BoltRoundedIcon />} label="Active Power" value={currentPower} unit="W" color="#3b82f6" isDark={isDark} />
              </Grid>
              <Grid item xs={4}>
                <PowerFlowBox icon={<TrendingUpRoundedIcon />} label="Total Exported" value={exportKwh.toFixed(2)} unit="kWh" color="#22c55e" isDark={isDark} />
              </Grid>
            </Grid>
            <Box sx={{
              mt: 3, p: 2, borderRadius: 2, textAlign: "center",
              bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}`,
            }}>
              <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>Net Energy</Typography>
              <Typography sx={{ fontSize: 28, fontWeight: 700, color: isExporting ? "#22c55e" : "#f97316" }}>
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
            {hourlyChartData.length > 0 ? (
              <Chart
                type="bar" height={300}
                options={makeBarChartOpts(hourlyChartData.map(d => d.x))}
                series={[
                  { name: "Imported (kWh)", data: hourlyChartData.map(d => d.import) },
                  { name: "Exported (kWh)", data: hourlyChartData.map(d => d.export) },
                ]}
              />
            ) : (
              <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: isDark ? "#475569" : "#94a3b8" }}>No hourly data available</Typography>
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* TAB 1: METER READINGS */}
      {tab === 1 && (
        <>
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 3, color: isDark ? "#e2e8f0" : "#1e293b", textAlign: "center" }}>
              Current Meter Register Values
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{
                  p: 3, borderRadius: 3, textAlign: "center",
                  bgcolor: isDark ? "rgba(249,115,22,0.06)" : "rgba(249,115,22,0.04)",
                  border: `2px solid rgba(249,115,22,0.15)`,
                }}>
                  <TrendingDownRoundedIcon sx={{ fontSize: 40, color: "#f97316", mb: 1 }} />
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", mb: 1, fontWeight: 500 }}>
                    Import Register (Grid to Home)
                  </Typography>
                  <Typography sx={{ fontSize: 36, fontWeight: 800, color: "#f97316", lineHeight: 1.2 }}>
                    {importKwh.toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: isDark ? "#64748b" : "#94a3b8", mt: 0.5 }}>kWh</Typography>
                  <Typography sx={{ fontSize: 11, color: isDark ? "#475569" : "#cbd5e1", mt: 1 }}>
                    Raw: {parseFloat(latest?.import_energy_wh || 0).toFixed(0)} Wh
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{
                  p: 3, borderRadius: 3, textAlign: "center",
                  bgcolor: isDark ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.04)",
                  border: `2px solid rgba(34,197,94,0.15)`,
                }}>
                  <TrendingUpRoundedIcon sx={{ fontSize: 40, color: "#22c55e", mb: 1 }} />
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b", mb: 1, fontWeight: 500 }}>
                    Export Register (Home to Grid)
                  </Typography>
                  <Typography sx={{ fontSize: 36, fontWeight: 800, color: "#22c55e", lineHeight: 1.2 }}>
                    {exportKwh.toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: isDark ? "#64748b" : "#94a3b8", mt: 0.5 }}>kWh</Typography>
                  <Typography sx={{ fontSize: 11, color: isDark ? "#475569" : "#cbd5e1", mt: 1 }}>
                    Raw: {parseFloat(latest?.export_energy_wh || 0).toFixed(0)} Wh
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{
              mt: 3, p: 2.5, borderRadius: 2, textAlign: "center",
              bgcolor: isExporting
                ? (isDark ? "rgba(34,197,94,0.08)" : "rgba(34,197,94,0.05)")
                : (isDark ? "rgba(249,115,22,0.08)" : "rgba(249,115,22,0.05)"),
              border: `1px solid ${isExporting ? "rgba(34,197,94,0.2)" : "rgba(249,115,22,0.2)"}`,
            }}>
              <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mb: 0.5 }}>Net Register Value</Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 800, color: isExporting ? "#22c55e" : "#f97316" }}>
                {netKwh > 0 ? "+" : ""}{netKwh.toFixed(2)} <span style={{ fontSize: 14, fontWeight: 400 }}>kWh</span>
              </Typography>
              <Typography sx={{ fontSize: 11, color: isDark ? "#475569" : "#94a3b8", mt: 0.5 }}>
                {isExporting ? "Credit: You have exported more than imported" : "Debit: You have imported more than exported"}
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Live Meter Parameters
            </Typography>
            <Grid container spacing={2}>
              {[
                { label: "Active Power", val: currentPower, unit: "W", color: "#3b82f6" },
                { label: "Voltage", val: voltage, unit: "V", color: "#8b5cf6" },
                { label: "Current", val: current, unit: "A", color: "#ec4899" },
                { label: "Frequency", val: frequency, unit: "Hz", color: "#06b6d4" },
              ].map((item, i) => (
                <Grid item xs={6} sm={3} key={i}>
                  <Box sx={{
                    p: 2, borderRadius: 2, textAlign: "center",
                    bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`,
                  }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color, mx: "auto", mb: 1 }} />
                    <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b", mb: 0.5 }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
                      {item.val} <span style={{ fontSize: 10, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>{item.unit}</span>
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper elevation={0} sx={cardSx}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Recent Readings
            </Typography>
            <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
              {history.slice(0, 20).map((h, i) => {
                const impK = whToKwh(h.import_energy_wh);
                const expK = whToKwh(h.export_energy_wh);
                const netK = whToKwh(h.net_energy_wh);
                return (
                  <Box key={i} sx={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    py: 1.2, px: 1.5, borderRadius: 1.5, mb: 0.5,
                    bgcolor: i % 2 === 0 ? (isDark ? "rgba(255,255,255,0.02)" : "#f8fafc") : "transparent",
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeRoundedIcon sx={{ fontSize: 14, color: isDark ? "#475569" : "#94a3b8" }} />
                      <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", fontFamily: "monospace" }}>
                        {formatTime(h.created_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Typography sx={{ fontSize: 12, color: "#f97316", fontWeight: 600 }}>
                        {impK.toFixed(2)} <span style={{ fontWeight: 400, fontSize: 10 }}>kWh</span>
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                        {expK.toFixed(2)} <span style={{ fontWeight: 400, fontSize: 10 }}>kWh</span>
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: netK < 0 ? "#22c55e" : "#f97316", fontWeight: 600 }}>
                        {netK > 0 ? "+" : ""}{netK.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
              {history.length === 0 && (
                <Typography sx={{ textAlign: "center", py: 3, color: isDark ? "#475569" : "#94a3b8", fontSize: 13 }}>
                  No readings available
                </Typography>
              )}
            </Box>
          </Paper>
        </>
      )}

      {/* TAB 2: DAILY HISTORY */}
      {tab === 2 && (
        <>
          {dailyData?.history?.length > 0 ? (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Paper elevation={0} sx={cardSx}>
                    <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b", mb: 0.5 }}>Total Import ({dailyData.days}d)</Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#f97316" }}>
                      {(dailyData.total_import_wh / 1000).toFixed(2)} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>kWh</span>
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper elevation={0} sx={cardSx}>
                    <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b", mb: 0.5 }}>Total Export ({dailyData.days}d)</Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#22c55e" }}>
                      {(dailyData.total_export_wh / 1000).toFixed(2)} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>kWh</span>
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper elevation={0} sx={cardSx}>
                    <Typography sx={{ fontSize: 11, color: isDark ? "#94a3b8" : "#64748b", mb: 0.5 }}>Net ({dailyData.days}d)</Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: dailyData.net_wh < 0 ? "#22c55e" : "#f97316" }}>
                      {(dailyData.net_wh / 1000).toFixed(2)} <span style={{ fontSize: 11, fontWeight: 400, color: isDark ? "#64748b" : "#94a3b8" }}>kWh</span>
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Paper elevation={0} sx={cardSx}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                  Daily Import / Export (Last {dailyData.days} Days)
                </Typography>
                <Chart
                  type="bar" height={350}
                  options={makeBarChartOpts(dailyData.history.map(d => d.label))}
                  series={[
                    { name: "Imported (kWh)", data: dailyData.history.map(d => parseFloat((d.import / 1000).toFixed(3))) },
                    { name: "Exported (kWh)", data: dailyData.history.map(d => parseFloat((d.export / 1000).toFixed(3))) },
                  ]}
                />
              </Paper>
            </>
          ) : (
            <Paper elevation={0} sx={cardSx}>
              <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: isDark ? "#475569" : "#94a3b8" }}>No daily history data available</Typography>
              </Box>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}

export default NetMetering;
