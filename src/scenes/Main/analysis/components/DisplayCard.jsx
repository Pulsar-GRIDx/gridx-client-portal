import React from "react";
import PropTypes from "prop-types";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../../theme/theme";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import { useEffect, useState } from "react";

/**
 * DisplayCard component for showing a metric with an icon, count, and percentage change.
 *
 * @component
 * @memberof AnalysisDash.Analysis_components
 * @param {Object} props - The props for the DisplayCard component.
 * @param {string} props.title - The title of the card.
 * @param {number} props.count - The count to be displayed.
 * @param {number} props.percentage - The percentage change to be displayed.
 * @param {React.ElementType} props.IconComponent - The icon component to be displayed.
 * @param {string} [props.color="primary"] - The color theme for the card.
 * @param {React.ReactNode|string} [props.extra] - Additional content to be displayed.
 * @returns {JSX.Element} The rendered DisplayCard component.
 */
const DisplayCard = ({ title, count, percentage, IconComponent }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [percentageDisplay, setPercentageDisplay] = useState(0);

  const borderedCard = {
    borderRadius: "5px",
    padding: "0px",
    backgroundColor: `${colors.primaryT[400]}`,
  };

  // Ensure count and percentage are not null or NaN
  count = count || 0;
  percentage = percentage || 0;

  useEffect(() => {
    if (percentage < 0) {
      setPercentageDisplay(percentage * -1);
    } else {
      setPercentageDisplay(percentage);
    }
  }, [percentage]);

  return (
    <Box sx={borderedCard}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <Box
            sx={{
              backgroundColor: colors.blueT[500],
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconComponent sx={{ color: colors.primary[100], fontSize: 40 }} />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={8}>
          <Box
            sx={{
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Typography variant="h5" color="textPrimary">
              {title}
            </Typography>
            <Typography variant="h3" color="textPrimary">
              {count}
            </Typography>

            <Typography
              variant="h6"
              color={percentage < 0 ? colors.red[500] : colors.green[500]}
              sx={{ display: percentage === 0 ? "none" : "block" }}
            >
              {percentage < 0 ? (
                <SouthEastIcon sx={{ color: `${colors.red[500]}` }} />
              ) : (
                <NorthEastIcon sx={{ color: `${colors.green[500]}` }} />
              )}
              {percentageDisplay} %
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

DisplayCard.propTypes = {
  /**
   * The title of the card.
   */
  title: PropTypes.string,
  /**
   * The count to be displayed.
   */
  count: PropTypes.number,
  /**
   * The percentage change to be displayed.
   */
  percentage: PropTypes.number,
  /**
   * The icon component to be displayed.
   */
  IconComponent: PropTypes.elementType.isRequired,
  /**
   * The color theme for the card.
   */
  color: PropTypes.string,
  /**
   * Additional content to be displayed.
   */
  extra: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

DisplayCard.defaultProps = {
  color: "primary",
  title: "No Title Provided",
  count: 0,
  percentage: 0,
};

export default DisplayCard;
