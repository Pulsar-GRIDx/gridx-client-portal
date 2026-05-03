import { useState, useContext } from "react";
import PropTypes from "prop-types";
import {
  AppBar, Box, Toolbar, IconButton, Typography, Badge, Menu, MenuItem,
  Alert, Tooltip, Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext, tokens } from "../../../theme/theme";
import { useNotificationData } from "../Data/getNotificationsData";
import { useData } from "../Data/getData";
import AuthContext from "../../../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import SignalCellular0BarRoundedIcon from "@mui/icons-material/SignalCellular0BarRounded";

const drawerWidth = 260;

function TopBar({ handleDrawerToggle }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { notifications } = useNotificationData();
  const { signalStrengthData } = useData();
  const { userInfo } = useContext(AuthContext);
  const isDark = theme.palette.mode === "dark";

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
        bgcolor: isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
        color: isDark ? "#f1f5f9" : "#0f172a",
      }}
    >
      <Toolbar sx={{ minHeight: "56px !important", px: { xs: 1.5, sm: 2.5 } }}>
        <IconButton
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 1, display: { sm: "none" }, color: "inherit" }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            GRIDx Portal
          </Typography>
          {drn && (
            <Chip
              label={drn}
              size="small"
              sx={{
                display: { xs: "none", md: "flex" },
                fontSize: 11, fontFamily: "monospace", fontWeight: 500, height: 24,
                bgcolor: isDark ? "rgba(59,130,246,0.12)" : "rgba(37,99,235,0.08)",
                color: isDark ? "#60a5fa" : "#2563eb",
                border: "none",
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
