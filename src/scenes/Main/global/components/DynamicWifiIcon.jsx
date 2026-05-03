import React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme/theme";
import { useData } from "../../Data/getData";
import SignalCellular0BarOutlinedIcon from "@mui/icons-material/SignalCellular0BarOutlined";
import SignalCellular1BarOutlinedIcon from "@mui/icons-material/SignalCellular1BarOutlined";
import SignalCellular2BarOutlinedIcon from "@mui/icons-material/SignalCellular2BarOutlined";
import SignalCellular3BarOutlinedIcon from "@mui/icons-material/SignalCellular3BarOutlined";
import SignalCellular4BarOutlinedIcon from "@mui/icons-material/SignalCellular4BarOutlined";
import SignalCellularConnectedNoInternet0BarOutlinedIcon from '@mui/icons-material/SignalCellularConnectedNoInternet0BarOutlined';

const getWifiIcon = (percentage, colors) => {
  if (percentage === 0) {
    return <SignalCellularConnectedNoInternet0BarOutlinedIcon style={{ color: colors.red[400] }} />;
  } else if (percentage > 0 && percentage <= 15) {
    return <SignalCellular0BarOutlinedIcon style={{ color: colors.primary[100] }} />;
  } else if (percentage > 15 && percentage <= 30) {
    return <SignalCellular1BarOutlinedIcon style={{ color: colors.primary[100] }} />;
  } else if (percentage > 30 && percentage <= 60) {
    return <SignalCellular2BarOutlinedIcon style={{ color: colors.primary[100] }} />;
  } else if (percentage > 60 && percentage <= 80) {
    return <SignalCellular3BarOutlinedIcon style={{ color: colors.primary[100] }} />;
  } else if (percentage > 80) {
    return <SignalCellular4BarOutlinedIcon style={{ color: colors.primary[100] }} />;
  } else {
    return <SignalCellular0BarOutlinedIcon style={{ color: colors.primary[100] }} />;
  }
};

const DynamicWifiIcon = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {signalStrengthData} = useData()

  return <div>{getWifiIcon(signalStrengthData, colors)}</div>;
};

export default DynamicWifiIcon;
