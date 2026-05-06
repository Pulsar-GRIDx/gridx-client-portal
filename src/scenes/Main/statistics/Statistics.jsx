import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, Grid, ToggleButton, ToggleButtonGroup,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { useData } from "../Data/getData";
import { energyDataAPI, meterDataAPI, vendingAPI } from "../../../services/api";
import Chart from "react-apexcharts";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

function Statistics() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";
  const { hourlyData, currentDayEnergy } = useData();

  const [period, setPeriod] = useState("hourly");
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [dailyPower, setDailyPower] = useState([]);
  const [tariffInfo, setTariffInfo] = useState(null);

  useEffect(() => {
    energyDataAPI.getWeekly().then(d => setWeeklyData(d?.data || d)).catch(() => {});
    energyDataAPI.getMonthlyYearly().then(d => setMonthlyData(d?.data || d)).catch(() => {});
    if (drn) {
      meterDataAPI.getDailyPower(drn).then(d => {
        const arr = Array.isArray(d) ? d : d?.data || [];
        setDailyPower(arr);
      }).catch(() => {});
      vendingAPI.getTariffInfo(drn).then(d => {
        setTariffInfo(d?.data || d);
      }).catch(() => {});
    }
  }, [drn]);

  const currentRate = parseFloat(tariffInfo?.currentRate || 0);

  const chartColors = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ef4444", "#eab308"];
  const baseChartOpts = {
    chart: { toolbar: { show: false }, background: "transparent" },
    fill: { type: "solid", opacity: 0.85 },
    xaxis: {
      labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" } },
      axisBorder: { show: false }, axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: isDark ? "#64748b" : "#94a3b8", fontSize: "10px" } } },
    grid: { borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: isDark ? "dark" : "light" },
    dataLabels: { enabled: false },
    legend: { labels: { colors: isDark ? "#94a3b8" : "#64748b" } },
  };

  const hourlyChartData = Array.isArray(hourlyData)
    ? hourlyData.map(d => ({
        x: d.hour || d.Hour || d.time || "",
        y: parseFloat(d.kWh || d.energy || d.Energy || d.value || 0),
      }))
    : [];

  const hourlyCostData = Array.isArray(hourlyData)
    ? hourlyData.map(d => {
        const kwh = parseFloat(d.kWh || d.energy || d.Energy || 0);
        return {
          hour: d.hour || d.Hour || d.time || "",
          kwh,
          avgPower: parseFloat(d.avgPower || d.avg_power || 0),
          cost: kwh * currentRate,
        };
      })
    : [];

  const totalKwh = hourlyCostData.reduce((s, h) => s + h.kwh, 0);
  const totalCost = hourlyCostData.reduce((s, h) => s + h.cost, 0);

  const cardSx = {
    p: 3, borderRadius: 3,
    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
  };

  const cellSx = {
    fontSize: 12,
    color: isDark ? "#e2e8f0" : "#1e293b",
    borderColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
  };

  const headerCellSx = {
    fontWeight: 600, fontSize: 11,
    color: isDark ? "#60a5fa" : "#2563eb",
    borderColor: isDark ? "rgba(59,130,246,0.2)" : "rgba(37,99,235,0.15)",
  };

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Statistics</Typography>
          <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
            Energy consumption analytics
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={period} exclusive onChange={(_, v) => v && setPeriod(v)}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "none", fontSize: 12, fontWeight: 500, px: 2, py: 0.7,
              borderColor: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
              color: isDark ? "#94a3b8" : "#64748b",
              "&.Mui-selected": {
                bgcolor: isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.08)",
                color: isDark ? "#60a5fa" : "#2563eb",
                borderColor: isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.2)",
              },
            },
          }}
        >
          <ToggleButton value="hourly">Hourly</ToggleButton>
          <ToggleButton value="daily">Daily</ToggleButton>
          <ToggleButton value="weekly">Weekly</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {period === "hourly" && (
        <>
          <Paper elevation={0} sx={{ ...cardSx, mb: 2 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Hourly Energy Consumption
            </Typography>
            {hourlyChartData.length > 0 ? (
              <Chart
                type="area" height={300}
                options={{
                  ...baseChartOpts,
                  colors: [chartColors[0]],
                  fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
                  stroke: { curve: "smooth", width: 2 },
                  xaxis: { ...baseChartOpts.xaxis, categories: hourlyChartData.map(d => d.x) },
                  yaxis: {
                    ...baseChartOpts.yaxis,
                    labels: {
                      ...baseChartOpts.yaxis.labels,
                      formatter: (v) => v.toFixed(3),
                    },
                  },
                  tooltip: { ...baseChartOpts.tooltip, y: { formatter: (v) => v.toFixed(4) + " kWh" } },
                }}
                series={[{ name: "Energy (kWh)", data: hourlyChartData.map(d => d.y) }]}
              />
            ) : (
              <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography sx={{ color: isDark ? "#475569" : "#94a3b8" }}>No hourly data available</Typography>
              </Box>
            )}
          </Paper>

          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                Hourly Usage &amp; Cost
              </Typography>
              {tariffInfo?.tariffGroup && (
                <Typography sx={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8" }}>
                  Tariff: {tariffInfo.tariffGroup.name} @ N$ {currentRate.toFixed(4)}/kWh ({tariffInfo.currentPeriod || "standard"})
                </Typography>
              )}
            </Box>
            {hourlyCostData.length > 0 ? (
              <TableContainer sx={{ maxHeight: 480 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {["Hour", "Avg Power (W)", "Energy (kWh)", "Cost (N$)"].map(h => (
                        <TableCell key={h} align={h === "Hour" ? "left" : "right"}
                          sx={{ ...headerCellSx, bgcolor: isDark ? "#0f1729" : "#fff" }}>
                          {h}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hourlyCostData.map((row, i) => {
                      const hasUsage = row.kwh > 0;
                      return (
                        <TableRow key={i} sx={{ "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)" } }}>
                          <TableCell sx={{ ...cellSx, fontWeight: 500 }}>{row.hour}</TableCell>
                          <TableCell align="right" sx={{ ...cellSx, color: isDark ? "#94a3b8" : "#64748b" }}>
                            {row.avgPower.toFixed(1)}
                          </TableCell>
                          <TableCell align="right" sx={{ ...cellSx, fontWeight: 600, color: hasUsage ? (isDark ? "#60a5fa" : "#2563eb") : (isDark ? "#475569" : "#cbd5e1") }}>
                            {row.kwh.toFixed(4)}
                          </TableCell>
                          <TableCell align="right" sx={{ ...cellSx, fontWeight: 600, color: hasUsage ? (isDark ? "#34d399" : "#059669") : (isDark ? "#475569" : "#cbd5e1") }}>
                            {row.cost.toFixed(4)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell sx={{ ...cellSx, fontWeight: 700, borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none" }}>
                        Total
                      </TableCell>
                      <TableCell sx={{ borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none" }} />
                      <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, color: isDark ? "#60a5fa" : "#2563eb", borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none" }}>
                        {totalKwh.toFixed(4)}
                      </TableCell>
                      <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, color: "#22c55e", borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none" }}>
                        N$ {totalCost.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ color: isDark ? "#475569" : "#94a3b8", fontSize: 13, textAlign: "center", py: 4 }}>
                No hourly data available
              </Typography>
            )}
          </Paper>
        </>
      )}

      {period === "daily" && (
        <Paper elevation={0} sx={cardSx}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Daily Power Consumption
          </Typography>
          {dailyPower.length > 0 ? (
            <Chart
              type="bar" height={350}
              options={{
                ...baseChartOpts,
                colors: [chartColors[1]],
                plotOptions: { bar: { borderRadius: 6, columnWidth: "55%" } },
                xaxis: {
                  ...baseChartOpts.xaxis,
                  categories: dailyPower.map(d => {
                    const dt = d.day || d.date || d.Date || d.date_time;
                    return dt ? new Date(dt).toLocaleDateString("en", { month: "short", day: "numeric" }) : "";
                  }),
                },
                yaxis: {
                  ...baseChartOpts.yaxis,
                  labels: {
                    ...baseChartOpts.yaxis.labels,
                    formatter: (v) => v.toFixed(1),
                  },
                },
                tooltip: { ...baseChartOpts.tooltip, y: { formatter: (v) => v.toFixed(2) + " W" } },
              }}
              series={[{ name: "Avg Power (W)", data: dailyPower.map(d => parseFloat(d.avg_power || d.energy || d.Energy || d.value || d.power || 0)) }]}
            />
          ) : (
            <Box sx={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ color: isDark ? "#475569" : "#94a3b8" }}>No daily data available</Typography>
            </Box>
          )}
        </Paper>
      )}

      {period === "weekly" && (
        <Paper elevation={0} sx={cardSx}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Weekly Energy Comparison
          </Typography>
          {weeklyData ? (
            <Chart
              type="bar" height={350}
              options={{
                ...baseChartOpts,
                colors: [chartColors[0], chartColors[2]],
                plotOptions: { bar: { borderRadius: 6, columnWidth: "45%", grouped: true } },
                xaxis: { ...baseChartOpts.xaxis, categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
              }}
              series={[
                { name: "This Week", data: weeklyData.currentWeek || weeklyData.currentweek || weeklyData.current || [0, 0, 0, 0, 0, 0, 0] },
                { name: "Last Week", data: weeklyData.lastWeek || weeklyData.lastweek || weeklyData.previous || [0, 0, 0, 0, 0, 0, 0] },
              ]}
            />
          ) : (
            <Box sx={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ color: isDark ? "#475569" : "#94a3b8" }}>No weekly data available</Typography>
            </Box>
          )}
        </Paper>
      )}

      {period === "monthly" && (
        <Paper elevation={0} sx={cardSx}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
            Monthly Energy Comparison
          </Typography>
          {monthlyData ? (
            <Chart
              type="bar" height={350}
              options={{
                ...baseChartOpts,
                colors: [chartColors[3], chartColors[4]],
                plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
                xaxis: { ...baseChartOpts.xaxis, categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
              }}
              series={[
                { name: "This Year", data: monthlyData.currentYear || monthlyData.Current || monthlyData.current || [] },
                { name: "Last Year", data: monthlyData.lastYear || monthlyData.Last || monthlyData.previous || [] },
              ]}
            />
          ) : (
            <Box sx={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography sx={{ color: isDark ? "#475569" : "#94a3b8" }}>No monthly data available</Typography>
            </Box>
          )}
        </Paper>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={cardSx}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Consumption Summary
            </Typography>
            {[
              { label: "Today", val: `${parseFloat(currentDayEnergy || 0).toFixed(2)} kWh`, color: "#3b82f6" },
              { label: "This Week", val: weeklyData?.currentWeekTotal ? `${weeklyData.currentWeekTotal} kWh` : "N/A", color: "#10b981" },
              { label: "This Month", val: monthlyData?.currentMonthTotal ? `${monthlyData.currentMonthTotal} kWh` : "N/A", color: "#f97316" },
            ].map((item, i) => (
              <Box key={i} sx={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                py: 1.5, borderBottom: i < 2 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}` : "none",
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
                  <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
                </Box>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>{item.val}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={cardSx}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
              Usage Insights
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{
                p: 2, borderRadius: 2,
                bgcolor: isDark ? "rgba(59,130,246,0.08)" : "rgba(37,99,235,0.05)",
                border: `1px solid ${isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.1)"}`,
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <CalendarTodayRoundedIcon sx={{ fontSize: 16, color: isDark ? "#60a5fa" : "#2563eb" }} />
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#60a5fa" : "#2563eb" }}>Peak Hours</Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
                  Monitor your peak consumption hours to optimize energy usage and reduce costs.
                </Typography>
              </Box>
              <Box sx={{
                p: 2, borderRadius: 2,
                bgcolor: isDark ? "rgba(16,185,129,0.08)" : "rgba(5,150,105,0.05)",
                border: `1px solid ${isDark ? "rgba(16,185,129,0.15)" : "rgba(5,150,105,0.1)"}`,
              }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: isDark ? "#34d399" : "#059669", mb: 0.5 }}>Energy Tip</Typography>
                <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
                  Shifting heavy loads to off-peak hours can reduce your electricity costs by up to 30%.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Statistics;
