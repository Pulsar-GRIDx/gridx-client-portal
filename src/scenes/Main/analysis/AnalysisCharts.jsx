import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Grid, Box } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChartYearly from "./components/ChartYearly";
import ChartWeekly from "./components/ChartWeekly";
import DisplayCard from "./components/DisplayCard";

/**
 * AnalysisCharts component renders various charts and display cards for analysis.
 * @memberof AnalysisDash.Analysis_components
 * @component
 * @example
 * const chartSeriesWeekly = {
 *   lastweek: [10, 20, 30, 40, 50, 60, 70],
 *   currentweek: [15, 25, 35, 45, 55, 65, 75]
 * };
 * const chartSeriesYearly = {
 *   Last: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
 *   Current: [150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150, 1250]
 * };
 * const timeperiodsEnergy = { day: 50, month: 1500, year: 18000 };
 * const percentageEnergy = { day: 5, month: 10, year: 15 };
 * return (
 *   <AnalysisCharts
 *     chartSeriesWeekly={chartSeriesWeekly}
 *     chartSeriesYearly={chartSeriesYearly}
 *     timeperiodsEnergy={timeperiodsEnergy}
 *     percentageEnergy={percentageEnergy}
 *   />
 * );
 *
 * @param {object} props - The component props
 * @param {object} props.chartSeriesWeekly - Weekly data series for charts
 * @param {object} props.chartSeriesYearly - Yearly data series for charts
 * @param {object} props.timeperiodsEnergy - Energy consumption data for different time periods
 * @param {object} props.percentageEnergy - Percentage change in energy consumption
 *
 * @returns {JSX.Element} The rendered AnalysisCharts component
 */
const AnalysisCharts = ({
  chartSeriesWeekly,
  chartSeriesYearly,
  timeperiodsEnergy,
  percentageEnergy,
}) => {
  const [chartSeriesWeek, setChartSeriesWeek] = useState([]);
  const [chartSeriesYear, setChartSeriesYear] = useState([]);

  useEffect(() => {
    setChartSeriesWeek([
      {
        name: "Last Week",
        data: chartSeriesWeekly.lastweek,
      },
      {
        name: "Current Week",
        data: chartSeriesWeekly.currentweek,
      },
    ]);

    setChartSeriesYear([
      {
        name: "Last Year",
        data: chartSeriesYearly.Last,
      },
      {
        name: "Current Year",
        data: chartSeriesYearly.Current,
      },
    ]);
  }, [chartSeriesWeekly, chartSeriesYearly]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <Box>
              <DisplayCard
                title="Daily Total Consumption"
                count={
                  timeperiodsEnergy.day == null
                    ? "0 kWh"
                    : `${timeperiodsEnergy.day} kWh`
                }
                percentage={
                  percentageEnergy.day == null ? 0 : percentageEnergy.day
                }
                IconComponent={LightModeIcon}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <DisplayCard
              title="Monthly Total Consumption"
              count={
                timeperiodsEnergy.month == null
                  ? "0 kWh"
                  : `${timeperiodsEnergy.month} kWh`
              }
              percentage={
                percentageEnergy.month == null ? 0 : percentageEnergy.month
              }
              IconComponent={InsertInvitationIcon}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box>
              <DisplayCard
                title="Yearly Total Consumption"
                count={
                  timeperiodsEnergy.year == null
                    ? "0 kWh"
                    : `${timeperiodsEnergy.year} kWh`
                }
                percentage={
                  percentageEnergy.year == null ? 0 : percentageEnergy.year
                }
                IconComponent={CalendarMonthIcon}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
        <Box>
          <ChartWeekly
            chartSeries={chartSeriesWeek}
            xaxisTitle={"kWh"}
            yaxisTitle={"Day"}
          />
        </Box>
      </Grid>

      {/* Chart Section */}
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Box>
          <ChartYearly
            chartSeriesYearly={chartSeriesYear}
            xaxisTitle={"Month"}
            yaxisTitle={"kWh"}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

AnalysisCharts.propTypes = {
  chartSeriesWeekly: PropTypes.object.isRequired,
  chartSeriesYearly: PropTypes.object.isRequired,
  timeperiodsEnergy: PropTypes.object.isRequired,
  percentageEnergy: PropTypes.object.isRequired,
};

export default AnalysisCharts;
