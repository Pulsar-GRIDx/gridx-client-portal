import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush,
  Legend,
} from 'recharts';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme/theme";

import { generateDateDataset } from '../../Data/DateFNS'; // Import your date dataset generator

/**
 * Linechart component for displaying a line chart with selectable views (daily and monthly).
 *
 * @component
 * @memberof Dashboard.Dashboard_components
 * @returns {JSX.Element} The rendered Linechart component.
 */
const Linechart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /**
   * Generate a random number between a given range.
   * 
   * @param {number} min - The minimum number in the range.
   * @param {number} max - The maximum number in the range.
   * @returns {number} A random number between min and max.
   */
  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Generate an array of 365 units of data, filling missing values with 0
  const dailyData = generateDateDataset().map((date) => ({
    name: date.formattedDate,
    value: generateRandomNumber(1, 50),
  }));

  // Sum the daily data to get monthly data
  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const startIndex = index * 30;
    const endIndex = startIndex + 30;
    const monthlySum = dailyData.slice(startIndex, endIndex).reduce((acc, data) => acc + data.value, 0);
    return {
      name: new Date(2023, index, 1).toLocaleString('en-US', { month: 'long' }), // Format month name
      value: monthlySum,
    };
  });

  const [selectedView, setSelectedView] = useState('daily');
  const [selectedData, setSelectedData] = useState(dailyData);

  useEffect(() => {
    if (selectedView === 'daily') {
      setSelectedData(dailyData);
    } else if (selectedView === 'monthly') {
      setSelectedData(monthlyData);
    }
    // Add logic for handling 'yearly' view here if needed
  }, [selectedView]);

  return (
    <div>
      <Select
        label="Select View"
        value={selectedView}
        onChange={(event) => setSelectedView(event.target.value)}
      >
        <MenuItem value="daily">Daily</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
        {/* Add menu item for 'yearly' view if needed */}
      </Select>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={selectedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Daily GB Used', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ backgroundColor: colors.green[700], border:"none", borderRadius:"10px"}}
            labelStyle={{ color: colors.black[300] }}
            itemStyle={{ color: colors.green[300] }}
            cursor={{ stroke: colors.red[600], strokeWidth: 2 }}
            wrapperStyle={{ backgroundColor: colors.green[700], borderRadius: '12px' }}
          />
          <ReferenceLine y={0} stroke="#000" />
          <Line type="monotone" dataKey="value" stroke={colors.green[600]} fill={colors.green[600]} />
          <Brush dataKey="name" height={25} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Linechart;
