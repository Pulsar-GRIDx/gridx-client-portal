import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme/theme";

/**
 * GeyserPie component displays a pie chart with predefined data.
 *
 * @memberof Dashboard.Dashboard_components
 * @component
 * @returns {JSX.Element} The rendered GeyserPie component.
 */
export default function GeyserPie() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Data for the pie chart
  const data = [
    { value: 17, color: `${colors.red[600]}` },
    { value: 89, color: `${colors.green[600]}` },
  ];
  
  // Size configuration for the pie chart
  const size = {
    width: 400,
    height: 200,
  };

  return (
    <PieChart
      series={[{ data }]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          fill: `${colors.primary[200]}`,
          fontWeight: 'bold',
        },
      }}
      {...size}
    />
  );
}
