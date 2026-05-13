import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useData } from "../Data/getData";
import ChartWeekly from "./components/ChartWeekly";
import ChartYearly from "./components/ChartYearly";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

function SummaryCard({ title, value, icon, color, pct, isDark }) {
  const isPositive = pct >= 0;
  return (
    <Paper elevation={0} sx={{
      p: 2.5, borderRadius: 3, height: "100%",
      bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
    }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", fontWeight: 500, mb: 0.5 }}>{title}</Typography>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a", lineHeight: 1.2 }}>
            {value}
          </Typography>
          {pct != null && (
            <Typography sx={{ fontSize: 11, color: isPositive ? "#22c55e" : "#ef4444", mt: 0.5, fontWeight: 500 }}>
              {isPositive ? "+" : ""}{parseFloat(pct || 0).toFixed(1)}% vs previous
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

const AnalysisDash = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { chartSeriesWeekly, chartSeriesYearly, timeperiodsEnergy, percentageEnergy } = useData();

  const cardSx = {
    p: 2.5, borderRadius: 3,
    bgcolor: isDark ? "rgba(30,41,59,0.6)" : "#fff",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
  };

  const chartSeriesWeek = [
    { name: "Last Week", data: chartSeriesWeekly?.lastweek || [] },
    { name: "Current Week", data: chartSeriesWeekly?.currentweek || [] },
  ];
  const chartSeriesYear = [
    { name: "Last Year", data: chartSeriesYearly?.Last || [] },
    { name: "Current Year", data: chartSeriesYearly?.Current || [] },
  ];

  return (
    <Box sx={{ maxHeight: "calc(100vh - 80px)", overflowY: "auto", pb: 4, px: { xs: 0, sm: 1 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h2" sx={{ color: isDark ? "#f1f5f9" : "#0f172a" }}>Analysis</Typography>
        <Typography sx={{ color: isDark ? "#64748b" : "#94a3b8", fontSize: 13, mt: 0.5 }}>
          Meter data analysis
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Daily Consumption" value={`${timeperiodsEnergy?.day ?? 0} kWh`}
            icon={<BoltRoundedIcon />} color="#3b82f6"
            pct={percentageEnergy?.day} isDark={isDark}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Monthly Consumption" value={`${timeperiodsEnergy?.month ?? 0} kWh`}
            icon={<CalendarMonthRoundedIcon />} color="#10b981"
            pct={percentageEnergy?.month} isDark={isDark}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SummaryCard
            title="Yearly Consumption" value={`${timeperiodsEnergy?.year ?? 0} kWh`}
            icon={<TrendingUpRoundedIcon />} color="#f97316"
            pct={percentageEnergy?.year} isDark={isDark}
          />
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
          Weekly Comparison
        </Typography>
        <ChartWeekly chartSeries={chartSeriesWeek} xaxisTitle="kWh" yaxisTitle="Day" />
      </Paper>

      <Paper elevation={0} sx={cardSx}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 2, color: isDark ? "#e2e8f0" : "#1e293b" }}>
          Yearly Comparison
        </Typography>
        <ChartYearly chartSeriesYearly={chartSeriesYear} xaxisTitle="Month" yaxisTitle="kWh" />
      </Paper>
    </Box>
  );
};

export default AnalysisDash;
