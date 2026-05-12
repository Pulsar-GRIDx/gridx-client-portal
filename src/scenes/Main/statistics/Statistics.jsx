import React, { useState, useEffect, useContext } from "react";
import {
  Box, Typography, Paper, ToggleButton, ToggleButtonGroup,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import { useData } from "../Data/getData";
import { energyDataAPI, meterDataAPI, vendingAPI, netMeteringAPI } from "../../../services/api";
import Chart from "react-apexcharts";

const IMPORT_RATE = 2.45;
const EXPORT_RATE = 1.60;

function Statistics() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { userInfo } = useContext(AuthContext);
  const drn = userInfo?.DRN || JSON.parse(sessionStorage.getItem("user") || "{}")?.DRN || "";
  const { hourlyData, timeperiodsEnergy, chartSeriesWeekly } = useData();

  const [period, setPeriod] = useState("hourly");
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [dailyPower, setDailyPower] = useState([]);
  const [tariffInfo, setTariffInfo] = useState(null);
  const [netHourlyData, setNetHourlyData] = useState(null);

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
      netMeteringAPI.getHourly(drn).then(d => {
        setNetHourlyData(d?.data || d);
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

  const netHourlyCost = (() => {
    const hourly = netHourlyData?.hourly;
    if (!Array.isArray(hourly)) return [];
    return hourly
      .filter(h => h.import > 0 || h.export > 0)
      .map(h => {
        const impKwh = (h.import || 0) / 1000;
        const expKwh = (h.export || 0) / 1000;
        return {
          hour: `${String(h.hour).padStart(2, "0")}:00`,
          importKwh: impKwh,
          exportKwh: expKwh,
          importCost: impKwh * IMPORT_RATE,
          exportCost: expKwh * EXPORT_RATE,
        };
      });
  })();
  const totalImportCost = netHourlyCost.reduce((s, h) => s + h.importCost, 0);
  const totalExportCost = netHourlyCost.reduce((s, h) => s + h.exportCost, 0);
  const totalImportKwh = netHourlyCost.reduce((s, h) => s + h.importKwh, 0);
  const totalExportKwh = netHourlyCost.reduce((s, h) => s + h.exportKwh, 0);

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

          {netHourlyCost.length > 0 && (
            <>
              <Paper elevation={0} sx={{ ...cardSx, mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                    Hourly Import / Export Cost
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8" }}>
                    Import: N$ {IMPORT_RATE.toFixed(4)}/kWh | Export: N$ {EXPORT_RATE.toFixed(4)}/kWh
                  </Typography>
                </Box>
                <TableContainer sx={{ maxHeight: 480 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        {["Hour", "Import (kWh)", "Import Cost (N$)", "Export (kWh)", "Export Cost (N$)", "Net Cost (N$)"].map(h => (
                          <TableCell key={h} align={h === "Hour" ? "left" : "right"}
                            sx={{ ...headerCellSx, bgcolor: isDark ? "#0f1729" : "#fff" }}>
                            {h}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {netHourlyCost.map((row, i) => {
                        const net = row.importCost - row.exportCost;
                        return (
                          <TableRow key={i} sx={{ "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)" } }}>
                            <TableCell sx={{ ...cellSx, fontWeight: 500 }}>{row.hour}</TableCell>
                            <TableCell align="right" sx={{ ...cellSx, color: "#f97316", fontWeight: 600 }}>
                              {row.importKwh.toFixed(4)}
                            </TableCell>
                            <TableCell align="right" sx={{ ...cellSx, color: "#f97316", fontWeight: 600 }}>
                              {row.importCost.toFixed(4)}
                            </TableCell>
                            <TableCell align="right" sx={{ ...cellSx, color: "#22c55e", fontWeight: 600 }}>
                              {row.exportKwh.toFixed(4)}
                            </TableCell>
                            <TableCell align="right" sx={{ ...cellSx, color: "#22c55e", fontWeight: 600 }}>
                              {row.exportCost.toFixed(4)}
                            </TableCell>
                            <TableCell align="right" sx={{ ...cellSx, fontWeight: 600, color: net > 0 ? "#f97316" : "#22c55e" }}>
                              {net > 0 ? "" : "-"}N$ {Math.abs(net).toFixed(4)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow>
                        <TableCell sx={{ ...cellSx, fontWeight: 700, borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none" }}>
                          Total
                        </TableCell>
                        <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, color: "#f97316", borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none" }}>
                          {totalImportKwh.toFixed(4)}
                        </TableCell>
                        <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, color: "#f97316", borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none" }}>
                          N$ {totalImportCost.toFixed(2)}
                        </TableCell>
                        <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, color: "#22c55e", borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none" }}>
                          {totalExportKwh.toFixed(4)}
                        </TableCell>
                        <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, color: "#22c55e", borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none" }}>
                          N$ {totalExportCost.toFixed(2)}
                        </TableCell>
                        <TableCell align="right" sx={{ ...cellSx, fontWeight: 700,
                          color: totalImportCost - totalExportCost > 0 ? "#f97316" : "#22c55e",
                          borderTop: `2px solid ${isDark ? "rgba(59,130,246,0.3)" : "rgba(37,99,235,0.15)"}`, borderBottom: "none"
                        }}>
                          {totalImportCost - totalExportCost > 0 ? "" : "-"}N$ {Math.abs(totalImportCost - totalExportCost).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              <Paper elevation={0} sx={{ ...cardSx, mt: 2 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                  Import vs Export Cost
                </Typography>
                <Chart
                  type="bar" height={380}
                  options={{
                    ...baseChartOpts,
                    colors: ["#f97316", "#22c55e"],
                    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
                    xaxis: {
                      ...baseChartOpts.xaxis,
                      categories: netHourlyCost.map(d => d.hour),
                      labels: { ...baseChartOpts.xaxis.labels, rotate: -45 },
                    },
                    yaxis: {
                      ...baseChartOpts.yaxis,
                      title: { text: "Cost (N$)", style: { color: isDark ? "#64748b" : "#94a3b8", fontSize: "11px" } },
                      labels: {
                        ...baseChartOpts.yaxis.labels,
                        formatter: (v) => "N$ " + v.toFixed(2),
                      },
                    },
                    tooltip: {
                      ...baseChartOpts.tooltip,
                      y: { formatter: (v) => "N$ " + v.toFixed(4) },
                    },
                    legend: { ...baseChartOpts.legend, position: "top" },
                  }}
                  series={[
                    { name: "Import Cost (N$)", data: netHourlyCost.map(d => parseFloat(d.importCost.toFixed(4))) },
                    { name: "Export Cost (N$)", data: netHourlyCost.map(d => parseFloat(d.exportCost.toFixed(4))) },
                  ]}
                />
              </Paper>
            </>
          )}
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

      <Paper elevation={0} sx={{ ...cardSx, mt: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
          Consumption Summary
        </Typography>
        {(() => {
          const todayKwh = parseFloat(timeperiodsEnergy?.day || 0);
          const weekArr = chartSeriesWeekly?.currentweek || chartSeriesWeekly?.currentWeek || [];
          const weekKwh = Array.isArray(weekArr) ? weekArr.reduce((s, v) => s + (parseFloat(v) || 0), 0) : 0;
          const monthKwh = parseFloat(timeperiodsEnergy?.month || 0);
          return [
            { label: "Today", kwh: todayKwh, color: "#3b82f6" },
            { label: "This Week", kwh: weekKwh, color: "#10b981" },
            { label: "This Month", kwh: monthKwh, color: "#f97316" },
          ].map((item, i) => (
            <Box key={i} sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              py: 1.5, borderBottom: i < 2 ? `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}` : "none",
            }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
                <Typography sx={{ fontSize: 13, color: isDark ? "#94a3b8" : "#64748b" }}>{item.label}</Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b" }}>
                  {item.kwh.toFixed(2)} kWh
                </Typography>
                {currentRate > 0 && (
                  <Typography sx={{ fontSize: 11, color: isDark ? "#34d399" : "#059669" }}>
                    N$ {(item.kwh * currentRate).toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Box>
          ));
        })()}
      </Paper>
    </Box>
  );
}

export default Statistics;
