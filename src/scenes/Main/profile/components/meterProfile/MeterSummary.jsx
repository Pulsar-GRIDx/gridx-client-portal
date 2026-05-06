import React from "react";
import { Divider, Grid, Paper, Typography, useTheme } from "@mui/material";
import ElectricMeterOutlinedIcon from "@mui/icons-material/ElectricMeterOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import HomeIcon from "@mui/icons-material/Home";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SignalCellularAltOutlinedIcon from "@mui/icons-material/SignalCellularAltOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { tokens } from "../../../../../theme/theme";

/**
 * MeterSummary displays a summary of meter data including power and network information.
 * It renders various metrics like power, voltage, current, frequency, and signal strength.
 *
 * @memberof ProfileDashboard.ProfileDashboard_components
 * @component
 * @param {Object} props Component props
 * @param {Object} props.loadData Object containing loaded data such as mains and geyser states
 * @param {Object} props.meterNetwork Object containing network-related meter data
 * @param {Object} props.meterPower Object containing power-related meter data
 * @param {Object} props.meterEnergy Object containing energy-related meter data (currently unused)
 * @returns {JSX.Element} Rendered MeterSummary component
 */
const MeterSummary = ({ loadData, meterNetwork, meterPower, meterEnergy }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const colorMains = loadData.mains_state === "1" ? "green" : "red";
  const colorHeater = loadData.geyser_state === "1" ? "green" : "red";

  const devices = [
    {
      title: "Power",
      value: meterPower.active_power,
      icon: ElectricMeterOutlinedIcon,
      Units: "W",
      color: "#FB8C00",
    },
    {
      title: "Voltage",
      value: meterPower.voltage,
      icon: ElectricBoltOutlinedIcon,
      Units: " Volts",
      color: "#FB8C00",
    },
    {
      title: "Current",
      value: meterPower.current,
      icon: EastOutlinedIcon,
      Units: " Amps",
      color: "#FB8C00",
    },
    {
      title: "Frequency",
      value: (parseFloat(meterPower.frequency || 0) * 100).toFixed(1),
      icon: AutoGraphIcon,
      Units: " Hz",
      color: "#FB8C00",
    },
    {
      title: "Signal",
      value: meterNetwork.signal_strength,
      icon: SignalCellularAltOutlinedIcon,
      Units: "dBm",
      color: "#FB8C00",
    },
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        m: 5,
        backgroundColor: `${colors.primaryT[400]}`, // Adjust transparency here
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Typography
            variant="h4"
            textAlign="center"
            color={colors.primary[100]}
          >
            Meter Power Reading
          </Typography>
          <Divider sx={{ my: 2 }} />
        </Grid>
        <Grid item xs={6} md={6} lg={6} xl={6} textAlign="center">
          <HomeIcon
            style={{
              color: colorMains,
            }}
            sx={{
              height: 40,
              width: 40,
            }}
          />
          <Typography style={{ color: colorMains }} variant="h6">
            Mains: {loadData.mains_state === "1" ? "ON" : "OFF"}
          </Typography>
        </Grid>
        <Grid item xs={6} md={6} lg={6} xl={6} textAlign="center">
          <LocalFireDepartmentIcon
            style={{
              color: colorHeater,
            }}
            sx={{
              height: 40,
              width: 40,
            }}
          />

          <Typography style={{ color: colorHeater }} variant="h6">
            Heater: {loadData.geyser_state === "1" ? "ON" : "OFF"}
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          {/* Additional content goes here */}
        </Grid>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          xl={12}
          container
          justifyContent="center"
          spacing={2}
        >
          {devices.map(({ color, icon: Icon, title, Units, value }) => (
            <Grid item key={title}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: `${colors.primaryT[400]}`,
                }}
              >
                <Icon color="action" />
                <Typography color={colors.primary[100]} variant="body1">
                  {title}
                </Typography>
                <Typography style={{ color }} variant="h6">
                  {value}
                  {Units}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MeterSummary;
