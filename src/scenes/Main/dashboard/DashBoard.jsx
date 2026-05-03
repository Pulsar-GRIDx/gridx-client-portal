import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, CssBaseline, Divider, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme/theme";
import AppWidgetSummary from "./components/app-widget-summary";
import DailyPowerLineChart from "./components/DailyPowerUsage";
import DailyDataLineChart from "./components/DailyDataUsage";
import GeyserPie from "./components/GeyserUsage";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import FourGMobiledataOutlinedIcon from "@mui/icons-material/FourGMobiledataOutlined";
import TungstenOutlinedIcon from "@mui/icons-material/TungstenOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import ColorBlocks from "./components/pie-chart-label";
import { useData } from "../Data/getData";

/**
 * @module Dashboard
 */

/**
 * @namespace Dashboard.Dashboard_components
 */

/**
 * Dashboard component to display various widgets and charts for user data.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { unitsData } = useData();
  const { averageUnitsData } = useData();
  const { loadData } = useData();

  const welcomeMessages = [
    "Hi, Welcome back 👋👋👋",
    "Hello, Nice to see you again 😊😊😊",
    "Greetings, Hope you are having a great day 🌞🌞🌞",
    "Hey, You are awesome 💯💯💯",
    "Hi there, You rock 🎸🎸🎸",
  ];

  const randomMessage =
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  const colorHeater = loadData.geyser_state === "1" ? "green" : "red";

  return (
    <Container
      sx={{
        overflowY: "scroll",
        maxHeight: "95vh",
        pb: "10vh",
      }}
    >
      <CssBaseline />
      <Grid container xs={12} md={12} lg={12} mb={2}>
        <Paper
          sx={{
            padding: "15px",
            backgroundColor: `${colors.primaryT[300]}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography variant="h4" sx={{ m: 2 }}>
            {randomMessage}
          </Typography>
        </Paper>
      </Grid>

      <Grid container spacing={1}>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Current Meter units"
            total={unitsData}
            color={unitsData > 15 ? "error" : "success"}
            bgcolor={colors.green[600]}
            icon={<BoltOutlinedIcon />}
            sx={{ backgroundColor: `${colors.primaryT[300]}` }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Daily Units Usage"
            total={Math.round(averageUnitsData)}
            color="warning"
            bgcolor={colors.blue[500]}
            icon={<TungstenOutlinedIcon />}
            sx={{ backgroundColor: `${colors.primaryT[300]}` }}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Geyser State"
            total={loadData.mains_state === "1" ? "ON" : "OFF"}
            color={colorHeater}
            bgcolor={colors.red[600]}
            icon={<LocalFireDepartmentOutlinedIcon />}
            sx={{ backgroundColor: `${colors.primaryT[300]}` }}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <Paper
            sx={{ padding: "15px", backgroundColor: `${colors.primaryT[300]}` }}
          >
            <Typography variant="h3">Total Power Consumption</Typography>
            <Divider />
            <DailyPowerLineChart />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
