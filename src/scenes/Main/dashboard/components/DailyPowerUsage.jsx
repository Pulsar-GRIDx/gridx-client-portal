import { useState, useEffect } from "react";
import { Box, useTheme, CardHeader, useMediaQuery } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import PowerCard from "./PowerMasurementCard";
import { tokens } from "../../../../theme/theme";
import { format, addDays } from "date-fns";
import { useData } from "../../Data/getData";

/**
 * DailyPowerLineChart component for displaying a daily power line chart with power measurement data.
 * 
 * @memberof Dashboard.Dashboard_components
 * @component
 * @returns {JSX.Element} The rendered DailyPowerLineChart component.
 */
const DailyPowerLineChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const {
    allData,
    startDate,
    grandTotal,
    averageSystemLoad,
  } = useData();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const chartHeight = isSmallScreen ? 300 : 450;

  const areaChartOptions = {
    chart: {
      height: chartHeight,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    grid: {
      strokeDashArray: 0,
    },
  };

  const [options, setOptions] = useState(areaChartOptions);
  const [selectedData, setSelectedData] = useState([]);

  /**
   * Generates a date dataset from the start date to the current date.
   *
   * @param {string} apiStartDate - The start date from the API.
   * @returns {Array} The generated date dataset.
   */
  const generateDateDataset = (apiStartDate) => {
    const startDate = new Date(apiStartDate);
    const endDate = new Date(); // Current date

    const dataset = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      dataset.push({
        name: format(currentDate, "EEE d MMM yyyy"), // Example: Monday 4 March 2024
        value: allData[dataset.length] || 0,
      });

      currentDate = addDays(currentDate, 1);
    }

    return dataset;
  };

  useEffect(() => {
    setSelectedData(generateDateDataset(startDate));
  }, [allData, startDate]);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[300]],
      xaxis: {
        categories: Array.from(
          { length: 24 },
          (_, i) => `${i < 10 ? "0" + i : i}:00`
        ),
        labels: {
          style: {
            colors: Array(selectedData.length).fill(secondary),
          },
        },
        axisBorder: {
          show: true,
          color: line,
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary],
          },
        },
        title: {
          text: "kW",
          style: {
            color: secondary,
          },
        },
      },
      grid: {
        borderColor: line,
      },
      tooltip: {
        theme: "dark",
        x: {
          format: "EEE",
        },
      },
    }));
  }, [theme, line, secondary, selectedData]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: "KwH",
        data: allData,
      },
    ]);
  }, [allData]);

  return (
    <Box sx={{ m: "10px 20px 2px 2px", mx: 1 }}>
      <Box display="flex" justifyContent="space-between">
        <CardHeader title="System" />
      </Box>
      <Box sx={{ mx: 5 }}>
        <PowerCard
          grandTotal={grandTotal}
          dailyPowerConsumption={averageSystemLoad}
        />
      </Box>
      <Box sx={{ paddingTop: "28px", mx: 1 }}>
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={chartHeight}
        />
      </Box>
    </Box>
  );
};

export default DailyPowerLineChart;
