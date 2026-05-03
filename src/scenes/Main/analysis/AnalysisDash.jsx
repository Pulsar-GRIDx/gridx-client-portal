import React from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme/theme";
import AnalysisCharts from "./AnalysisCharts";
import { useData } from "../Data/getData";
import AssessmentIcon from "@mui/icons-material/Assessment";

/**
 * @module AnalysisDash
 */

/**
 * @namespace AnalysisDash.Analysis_components
 */

/**
 * AnalysisDash component renders the analysis dashboard with charts.
 *
 * @component
 * @example
 * return (
 *   <AnalysisDash />
 * );
 *
 * @returns {JSX.Element} The rendered AnalysisDash component.
 */
const AnalysisDash = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    chartSeriesWeekly,
    chartSeriesYearly /**
     * @module Main/Dashboard
     */,
    timeperiodsEnergy,
    percentageEnergy,
  } = useData();

  return (
    <Box
      // m="20px"
      sx={{
        overflowY: "scroll",
        maxHeight: "95vh",
        pb: "10vh",
      }}
    >
      <Box
        mb="20px"
        sx={{
          borderRadius: "10px",
          padding: "0px",
          backgroundColor: `${colors.primaryT[400]}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "15px 15px 5px 15px",
          }}
        >
          <IconButton color={colors.primary[200]}>
            <AssessmentIcon />
          </IconButton>
          <Typography variant="h2" sx={{ marginLeft: "10px" }}>
            Analysis
          </Typography>
        </Box>
        <Typography variant="subtitle" sx={{ padding: "0 15px 25px 25px" }}>
          Meter Data Analysis
        </Typography>
      </Box>

      <Box>
        <AnalysisCharts
          chartSeriesWeekly={chartSeriesWeekly}
          chartSeriesYearly={chartSeriesYearly}
          timeperiodsEnergy={timeperiodsEnergy}
          percentageEnergy={percentageEnergy}
        />
      </Box>
    </Box>
  );
};

export default AnalysisDash;
