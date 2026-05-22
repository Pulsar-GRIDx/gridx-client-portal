import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, Paper, Grid, Chip, IconButton, Tooltip, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { dataUsageAPI } from "../../../services/api";
import Chart from "react-apexcharts";
import CellTowerRoundedIcon from "@mui/icons-material/CellTowerRounded";
import DataUsageRoundedIcon from "@mui/icons-material/DataUsageRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

const DataUsage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || "";

  const [todayData, setTodayData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [view, setView] = useState("today");
  const [loading, setLoading] = useState(true);

  const cardBg = isDark ? "#1e293b" : "#ffffff";
  const cardBorder = isDark ? "1px solid rgba(148,163,184,0.1)" : "1px solid rgba(0,0,0,0.06)";
  const textPrimary = isDark ? "#f1f5f9" : "#0f172a";
  const textSecondary = isDark ? "#94a3b8" : "#64748b";

  const fetchData = async () => {
    if (!drn) return;
    setLoading(true);
    try {
      const [today, daily, bk] = await Promise.all([
        dataUsageAPI.getToday(drn),
        dataUsageAPI.getDaily(drn, 30),
        dataUsageAPI.getBreakdown(drn, 7),
      ]);
      setTodayData(today);
      setDailyData(daily);
      setBreakdown(bk);
    } catch (err) {
      console.error("Data usage fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [drn]);

  const formatBytes = (bytes) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const formatCost = (cost, currency) => {
    if (!currency) currency = "NAD";
    return `${currency === "NAD" ? "N$" : currency} ${cost.toFixed(2)}`;
  };

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: cardBg, border: cardBorder, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography sx={{ fontSize: 13, color: textSecondary, mb: 0.5, fontWeight: 500 }}>{title}</Typography>
          <Typography sx={{ fontSize: 26, fontWeight: 700, color: textPrimary, lineHeight: 1.2 }}>{value}</Typography>
          {subtitle && <Typography sx={{ fontSize: 12, color: textSecondary, mt: 0.5 }}>{subtitle}</Typography>}
        </Box>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {React.cloneElement(icon, { sx: { fontSize: 24, color } })}
        </Box>
      </Box>
    </Paper>
  );

  const hourlyChartOpts = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "Inter, sans-serif" },
    stroke: { curve: "smooth", width: 2.5 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05, stops: [0, 90, 100] } },
    colors: ["#3b82f6"],
    xaxis: {
      categories: todayData ? todayData.hourly.map(h => h.label) : [],
      labels: { style: { colors: textSecondary, fontSize: "11px" }, rotate: -45, rotateAlways: false, hideOverlappingLabels: true },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: textSecondary, fontSize: "11px" }, formatter: (v) => `${(v / 1024).toFixed(1)} KB` } },
    grid: { borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(0,0,0,0.06)", strokeDashArray: 4 },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: { formatter: (v) => formatBytes(v) },
      x: { show: true },
    },
    dataLabels: { enabled: false },
    markers: { size: 0 },
  };

  const hourlySeries = [{
    name: "Data Used",
    data: todayData ? todayData.hourly.map(h => h.bytes) : [],
  }];

  const costChartOpts = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
    colors: ["#f97316"],
    xaxis: {
      categories: todayData ? todayData.hourly.map(h => h.label) : [],
      labels: { style: { colors: textSecondary, fontSize: "11px" }, rotate: -45, hideOverlappingLabels: true },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: textSecondary, fontSize: "11px" }, formatter: (v) => `N$ ${v.toFixed(2)}` } },
    grid: { borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(0,0,0,0.06)", strokeDashArray: 4 },
    tooltip: { theme: isDark ? "dark" : "light", y: { formatter: (v) => formatCost(v, todayData?.currency) } },
    dataLabels: { enabled: false },
  };

  const costSeries = [{
    name: "Cost",
    data: todayData ? todayData.hourly.map(h => h.cost) : [],
  }];

  const dailyChartOpts = {
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "Inter, sans-serif", stacked: false },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
    colors: ["#3b82f6", "#f97316"],
    xaxis: {
      categories: dailyData ? dailyData.daily.map(d => { const dt = new Date(d.date); return `${dt.getDate()}/${dt.getMonth() + 1}`; }) : [],
      labels: { style: { colors: textSecondary, fontSize: "11px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: [
      { title: { text: "Data (KB)", style: { color: textSecondary, fontSize: "12px" } }, labels: { style: { colors: textSecondary, fontSize: "11px" }, formatter: (v) => `${v.toFixed(0)}` } },
      { opposite: true, title: { text: "Cost (N$)", style: { color: textSecondary, fontSize: "12px" } }, labels: { style: { colors: textSecondary, fontSize: "11px" }, formatter: (v) => `${v.toFixed(2)}` } },
    ],
    grid: { borderColor: isDark ? "rgba(148,163,184,0.1)" : "rgba(0,0,0,0.06)", strokeDashArray: 4 },
    tooltip: { theme: isDark ? "dark" : "light" },
    dataLabels: { enabled: false },
    legend: { labels: { colors: textSecondary } },
  };

  const dailySeries = dailyData ? [
    { name: "Data (KB)", type: "bar", data: dailyData.daily.map(d => d.kb) },
    { name: "Cost (N$)", type: "line", data: dailyData.daily.map(d => d.cost) },
  ] : [];

  const breakdownChartOpts = {
    chart: { type: "donut", fontFamily: "Inter, sans-serif" },
    labels: breakdown ? breakdown.breakdown.map(b => b.type) : [],
    colors: ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#06b6d4", "#eab308", "#ef4444", "#64748b"],
    legend: { position: "bottom", labels: { colors: textSecondary } },
    dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
    tooltip: { theme: isDark ? "dark" : "light" },
    stroke: { show: false },
    plotOptions: { pie: { donut: { size: "65%", labels: { show: true, total: { show: true, label: "Total", color: textSecondary, formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString() } } } } },
  };

  const breakdownSeries = breakdown ? breakdown.breakdown.map(b => b.count) : [];

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <CellTowerRoundedIcon sx={{ fontSize: 28, color: "#3b82f6" }} />
          <Typography variant="h5" sx={{ fontWeight: 700, color: textPrimary }}>Data Usage</Typography>
          <Chip label="Live Tracking" size="small" sx={{ bgcolor: "rgba(34,197,94,0.15)", color: "#22c55e", fontWeight: 600, fontSize: 11 }} />
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <ToggleButtonGroup value={view} exclusive onChange={(e, v) => { if (v) setView(v); }} size="small">
            <ToggleButton value="today" sx={{ px: 2, fontSize: 12, textTransform: "none" }}>
              <TodayRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> Today
            </ToggleButton>
            <ToggleButton value="monthly" sx={{ px: 2, fontSize: 12, textTransform: "none" }}>
              <CalendarMonthRoundedIcon sx={{ fontSize: 16, mr: 0.5 }} /> 30 Days
            </ToggleButton>
          </ToggleButtonGroup>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchData} size="small">
              <RefreshRoundedIcon sx={{ color: textSecondary }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <StatCard
            title={view === "today" ? "Today's Data" : "30-Day Data"}
            value={view === "today" ? formatBytes(todayData?.totalBytes || 0) : formatBytes(dailyData?.totalBytes || 0)}
            subtitle={view === "today" ? `${todayData?.totalMsgs || 0} messages` : `${dailyData?.daily?.reduce((s, d) => s + d.msgs, 0) || 0} messages`}
            icon={<DataUsageRoundedIcon />}
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title={view === "today" ? "Today's Cost" : "30-Day Cost"}
            value={formatCost(view === "today" ? (todayData?.totalCost || 0) : (dailyData?.totalCost || 0), todayData?.currency)}
            subtitle={`@ N$ ${todayData?.costPerMb || 0.50}/MB`}
            icon={<AttachMoneyRoundedIcon />}
            color="#f97316"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Messages Today"
            value={(todayData?.totalMsgs || 0).toLocaleString()}
            subtitle="MQTT transmissions"
            icon={<MessageRoundedIcon />}
            color="#22c55e"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            title="Cost / MB"
            value={`N$ ${todayData?.costPerMb || 0.50}`}
            subtitle={todayData?.currency || "NAD"}
            icon={<CellTowerRoundedIcon />}
            color="#a855f7"
          />
        </Grid>
      </Grid>

      {view === "today" ? (
        <>
          {/* Hourly Data Usage Chart */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: cardBg, border: cardBorder, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <DataUsageRoundedIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
                <Typography sx={{ fontWeight: 600, fontSize: 15, color: textPrimary }}>Hourly Data Consumption</Typography>
              </Box>
              <Chip label={formatBytes(todayData?.totalBytes || 0)} size="small" sx={{ bgcolor: "rgba(59,130,246,0.12)", color: "#3b82f6", fontWeight: 600, fontSize: 11 }} />
            </Box>
            <Chart options={hourlyChartOpts} series={hourlySeries} type="area" height={280} />
          </Paper>

          {/* Hourly Cost Chart */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: cardBg, border: cardBorder, mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AttachMoneyRoundedIcon sx={{ fontSize: 20, color: "#f97316" }} />
                <Typography sx={{ fontWeight: 600, fontSize: 15, color: textPrimary }}>Hourly Transmission Cost</Typography>
              </Box>
              <Chip label={formatCost(todayData?.totalCost || 0, todayData?.currency)} size="small" sx={{ bgcolor: "rgba(249,115,22,0.12)", color: "#f97316", fontWeight: 600, fontSize: 11 }} />
            </Box>
            <Chart options={costChartOpts} series={costSeries} type="bar" height={250} />
          </Paper>
        </>
      ) : (
        /* 30-Day Daily Chart */
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: cardBg, border: cardBorder, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarMonthRoundedIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
              <Typography sx={{ fontWeight: 600, fontSize: 15, color: textPrimary }}>Daily Data Usage & Cost (30 Days)</Typography>
            </Box>
            <Chip label={formatBytes(dailyData?.totalBytes || 0)} size="small" sx={{ bgcolor: "rgba(59,130,246,0.12)", color: "#3b82f6", fontWeight: 600, fontSize: 11 }} />
          </Box>
          <Chart options={dailyChartOpts} series={dailySeries} type="line" height={320} />
        </Paper>
      )}

      {/* Message Type Breakdown */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: cardBg, border: cardBorder }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <MessageRoundedIcon sx={{ fontSize: 20, color: "#a855f7" }} />
          <Typography sx={{ fontWeight: 600, fontSize: 15, color: textPrimary }}>Message Type Breakdown (7 Days)</Typography>
        </Box>
        {breakdownSeries.length > 0 ? (
          <Chart options={breakdownChartOpts} series={breakdownSeries} type="donut" height={300} />
        ) : (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography sx={{ color: textSecondary, fontSize: 14 }}>No data available yet. Tracking starts when the meter sends its first message.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DataUsage;
