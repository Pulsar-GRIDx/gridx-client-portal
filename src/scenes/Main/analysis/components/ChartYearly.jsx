import PropTypes from "prop-types";
import { Box, CardContent, CardHeader } from "@mui/material";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../../theme/theme";

/**
 * Generates chart options based on the provided parameters.
 *
 * @function
 * @param {Object} params - The parameters for generating chart options.
 * @param {string} params.xaxisTitle - The title for the x-axis.
 * @param {string} params.yaxisTitle - The title for the y-axis.
 * @returns {Object} The chart options.
 */
const useChartOptions = ({ xaxisTitle, yaxisTitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Define categories here
  const categories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [`${colors.green[400]}`, `${colors.blue[400]}`],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    grid: {
      borderColor: "transparent",
      strokeDashArray: 10,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: true,
    },
    plotOptions: {
      bar: {
        columnWidth: "10px",
      },
    },
    stroke: {
      colors: ["transparent"],
      show: true,
      width: 1,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: colors.blue[500],
        show: true,
      },
      axisTicks: {
        color: colors.blue[500],
        show: true,
      },
      categories: categories,
      labels: {
        offsetY: 5,
        style: {
          colors: colors.red[500],
        },
      },
      title: {
        text: xaxisTitle,
        offsetX: 8,
        style: {
          color: colors.red[500],
        },
      },
    },
    yaxis: {
      title: {
        text: yaxisTitle,
        offsetX: 5,
        style: {
          color: colors.red[500],
        },
      },
      axisBorder: {
        color: colors.blue[500],
        show: true,
      },
      axisTicks: {
        color: colors.blue[500],
        show: true,
      },
      labels: {
        formatter: (value) => (value > 0 ? `${value}` : `${value}`),
        offsetX: -10,
        style: {
          colors: colors.red[500],
        },
      },
    },
  };
};

/**
 * A React component that renders a yearly chart using ReactApexChart.
 *
 * @component
 * @memberof AnalysisDash.Analysis_components
 * @param {Object} props - The props for the component.
 * @param {Array.<Object>} props.chartSeriesYearly - The data series for the chart.
 * @param {string} props.xaxisTitle - The title for the x-axis.
 * @param {string} props.yaxisTitle - The title for the y-axis.
 * @returns {JSX.Element} The rendered component.
 */
const ChartYearly = ({ chartSeriesYearly, xaxisTitle, yaxisTitle }) => {
  const chartOptions = useChartOptions({ xaxisTitle, yaxisTitle });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const borderedCard = {
    borderRadius: "5px",
    padding: "0px",
    backgroundColor: `${colors.primaryT[400]}`,
  };

  return (
    <Box sx={borderedCard}>
      <CardHeader title="Yearly Chart" />
      <CardContent>
        <ReactApexChart
          height={450}
          options={chartOptions}
          series={chartSeriesYearly}
          type="bar"
        />
      </CardContent>
    </Box>
  );
};

ChartYearly.propTypes = {
  chartSeriesYearly: PropTypes.array,
  xaxisTitle: PropTypes.string,
  yaxisTitle: PropTypes.string,
};

export default ChartYearly;
