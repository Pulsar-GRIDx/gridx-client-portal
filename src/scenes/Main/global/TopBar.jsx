import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  AppBar, Box, Toolbar, IconButton, Typography, Badge, Menu, MenuItem,
  Alert, Tooltip, Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext, tokens, mtc } from "../../../theme/theme";
import { useNotificationData } from "../Data/getNotificationsData";
import { useData } from "../Data/getData";
import AuthContext from "../../../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import SignalCellular0BarRoundedIcon from "@mui/icons-material/SignalCellular0BarRounded";

const drawerWidth = 264;

function TopBar({ handleDrawerToggle }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { notifications } = useNotificationData();
  const { signalStrengthData } = useData();
  const { userInfo } = useContext(AuthContext);
  const location = useLocation();
  const isDark = theme.palette.mode === "dark";
  const isHome = location.pathname === "/";

  const [anchorElNoti, setAnchorElNoti] = useState(null);
  const notificationsCount = notifications?.length || 0;

  const drn = userInfo?.DRN || "";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: isDark ? "rgba(10, 15, 30, 0.8)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${isDark ? "rgba(148,163,184,0.1)" : "#e2e8f0"}`,
        color: isDark ? "#f1f5f9" : "#0f172a",
        "&::after": {
          content: '""', position: "absolute", left: 0, right: 0, bottom: -1, height: 2,
          background: mtc.gradient, opacity: isDark ? 0.6 : 0.4,
        },
      }}
    >
      <Toolbar sx={{ minHeight: "60px !important", px: { xs: 1.5, sm: 2.5 } }}>
        <IconButton
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 1, display: { sm: "none" }, color: "inherit" }}
        >
          <MenuIcon />
        </IconButton>

        <Tooltip title="Home">
          <span>
            <IconButton
              component={RouterLink}
              to="/"
              disabled={isHome}
              size="small"
              sx={{
                mr: 1,
                color: isHome ? (isDark ? mtc.blue[300] : mtc.blue[600]) : "inherit",
                border: `1px solid ${isHome ? (isDark ? "rgba(31,99,242,0.35)" : "rgba(13,79,219,0.25)") : "transparent"}`,
                borderRadius: 0.5,
                "&.Mui-disabled": { color: isDark ? mtc.blue[300] : mtc.blue[600] },
              }}
            >
              <HomeRoundedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}>
            GRIDx Portal
          </Typography>
          {drn && (
            <Chip
              label={drn}
              size="small"
              sx={{
                display: { xs: "none", md: "flex" },
                fontSize: 11, fontFamily: "monospace", fontWeight: 600, height: 24,
                bgcolor: isDark ? "rgba(31,99,242,0.14)" : "rgba(13,79,219,0.08)",
                color: isDark ? mtc.blue[300] : mtc.blue[600],
                border: `1px solid ${isDark ? "rgba(31,99,242,0.25)" : "rgba(13,79,219,0.15)"}`,
              }}
            />
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Tooltip title={signalStrengthData > 0 ? `Signal: ${signalStrengthData}%` : "No Signal"}>
            <IconButton size="small" sx={{ color: signalStrengthData > 0 ? colors.green[500] : colors.red[500] }}>
              {signalStrengthData > 0 ? <SignalCellularAltRoundedIcon fontSize="small" /> : <SignalCellular0BarRoundedIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          <IconButton size="small" onClick={colorMode.toggleColorMode} sx={{ color: "inherit" }}>
            {isDark ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
          </IconButton>

          <IconButton size="small" onClick={(e) => setAnchorElNoti(e.currentTarget)} sx={{ color: "inherit" }}>
            <Badge badgeContent={notificationsCount > 0 ? notificationsCount : null} color="error" max={99}>
              <NotificationsNoneRoundedIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorElNoti}
          open={Boolean(anchorElNoti)}
          onClose={() => setAnchorElNoti(null)}
          PaperProps={{
            sx: {
              mt: 1, maxHeight: 400, minWidth: 300, maxWidth: 400,
              bgcolor: isDark ? "#1e293b" : "#fff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem disabled sx={{ opacity: 1 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              Notifications {notificationsCount > 0 && `(${notificationsCount})`}
            </Typography>
          </MenuItem>
          {notificationsCount > 0 ? (
            notifications.slice(0, 20).map((n, i) => (
              <MenuItem key={i} sx={{ whiteSpace: "normal", py: 1 }}>
                <Alert severity="info" sx={{ width: "100%", py: 0, "& .MuiAlert-message": { fontSize: 12 } }}>
                  {n.Alarm}
                </Alert>
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <Alert severity="info" sx={{ width: "100%" }}>No notifications</Alert>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

TopBar.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default TopBar;
