import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import CurrentIcon from "@mui/icons-material/ElectricalServices";
import SettingsInputCompositeIcon from "@mui/icons-material/SettingsInputComposite";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../../theme/theme";
import PropTypes from "prop-types";

const digitalFont = {
  fontFamily: "Digital-7, monospace",
};

/**
 * PowerCard displays power-related information in a styled grid layout.
 *
 * @memberof Dashboard.Dashboard_components
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.grandTotal - The total energy consumption (in KWh).
 * @param {number} props.dailyPowerConsumption - The average system load (in KW).
 * @returns {JSX.Element} The rendered PowerCard component.
 */
const PowerCard = ({ grandTotal, dailyPowerConsumption }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Grid container spacing={6}>
      {/* Average System Load */}
      <Grid item xs={12} sm={6} md={3} lg={4}>
        <Box display="flex" alignItems="left">
          <Box marginRight="10px">
            <SettingsInputCompositeIcon
              fontSize="large"
              sx={{ digitalFont, color: colors.green[500] }}
            />
          </Box>
          <Box>
            <Typography variant="h3">Average System Load</Typography>
            <Typography
              variant="h4"
              sx={{ digitalFont, color: colors.green[500] }}
            >
              {isNaN(dailyPowerConsumption)
                ? 0
                : Math.round(dailyPowerConsumption)}{" "}
              KW
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Current Day Energy */}
      <Grid item xs={12} sm={6} md={3} lg={3}>
        <Box display="flex" alignItems="left">
          <Box>
            <CurrentIcon
              fontSize="large"
              sx={{ digitalFont, color: colors.green[500] }}
            />
          </Box>
          <Box>
            <Typography variant="h6">Current Day Energy</Typography>
            <Typography
              variant="h4"
              sx={{ digitalFont, color: colors.green[500] }}
            >
              {isNaN(grandTotal) ? 0 : Math.round(grandTotal)} Units / Kwh
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

PowerCard.propTypes = {
  /**
   * The total energy consumption (in KWh).
   */
  grandTotal: PropTypes.number,
  /**
   * The average system load (in KW).
   */
  dailyPowerConsumption: PropTypes.number,
};

export default PowerCard;
