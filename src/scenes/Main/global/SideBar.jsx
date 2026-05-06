import { useContext } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Divider, IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../../context/AuthContext";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SolarPowerRoundedIcon from "@mui/icons-material/SolarPowerRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const drawerWidth = 260;

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardRoundedIcon /> },
  { label: "Geyser Control", path: "/geyser", icon: <WaterDropRoundedIcon /> },
  { label: "Recharge", path: "/recharge", icon: <AccountBalanceWalletRoundedIcon /> },
  { label: "Statistics", path: "/statistics", icon: <BarChartRoundedIcon /> },
  { label: "Net Metering", path: "/net-metering", icon: <SolarPowerRoundedIcon /> },
  { divider: true },
  { label: "Profile", path: "/profile", icon: <PersonRoundedIcon /> },
  { label: "Settings", path: "/settings", icon: <SettingsRoundedIcon /> },
];

function Sidebar({ window, mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const location = useLocation();
  const { userInfo, HandleLogOut } = useContext(AuthContext);
  const isDark = theme.palette.mode === "dark";

  const container = window !== undefined ? () => window().document.body : undefined;

  const userName = userInfo
    ? `${userInfo.FirstName || ""} ${userInfo.LastName || ""}`.trim() || userInfo.Email
    : "User";
  const userDRN = userInfo?.DRN || "";

  const sidebarBg = isDark ? "#0c1222" : "#ffffff";
  const activeBg = isDark ? "rgba(59,130,246,0.15)" : "rgba(37,99,235,0.08)";
  const activeColor = isDark ? "#60a5fa" : "#2563eb";
  const textColor = isDark ? "#cbd5e1" : "#334155";
  const hoverBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", py: 2 }}>
      <Box sx={{ px: 2.5, mb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <img src="/meter-logo-small.png" alt="GRIDx" style={{ width: 48, height: "auto" }} />
          <Typography sx={{ fontWeight: 700, fontSize: 18, color: isDark ? "#f1f5f9" : "#0f172a" }}>
            GRIDx
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ display: { sm: "none" }, color: textColor }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: 2, my: 2 }}>
        <Box sx={{
          p: 1.5, borderRadius: 2,
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          display: "flex", alignItems: "center", gap: 1.5,
        }}>
          <Avatar sx={{
            width: 38, height: 38,
            bgcolor: isDark ? "#1e3a5f" : "#dbeafe",
            color: isDark ? "#60a5fa" : "#2563eb",
            fontSize: 15, fontWeight: 600,
          }}>
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{
              fontSize: 13, fontWeight: 600, color: isDark ? "#e2e8f0" : "#1e293b",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {userName}
            </Typography>
            {userDRN && (
              <Typography sx={{ fontSize: 11, color: isDark ? "#64748b" : "#94a3b8", fontFamily: "monospace" }}>
                {userDRN}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <List sx={{ flex: 1, px: 1.5 }}>
        {navItems.map((item, idx) => {
          if (item.divider) return <Divider key={idx} sx={{ my: 1.5, borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }} />;
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.3 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => mobileOpen && handleDrawerToggle()}
                sx={{
                  borderRadius: 2, py: 1, px: 1.5,
                  bgcolor: isActive ? activeBg : "transparent",
                  "&:hover": { bgcolor: isActive ? activeBg : hoverBg },
                  transition: "all 0.15s ease",
                }}
              >
                <ListItemIcon sx={{
                  minWidth: 36, color: isActive ? activeColor : textColor,
                  "& .MuiSvgIcon-root": { fontSize: 20 },
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                    color: isActive ? activeColor : textColor,
                  }}
                />
                {isActive && (
                  <Box sx={{
                    width: 4, height: 20, borderRadius: 2,
                    bgcolor: activeColor, ml: 1,
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ px: 1.5, pb: 1 }}>
        <ListItemButton
          onClick={HandleLogOut}
          sx={{
            borderRadius: 2, py: 1, px: 1.5,
            "&:hover": { bgcolor: "rgba(239,68,68,0.08)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "#ef4444", "& .MuiSvgIcon-root": { fontSize: 20 } }}>
            <LogoutRoundedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Log Out"
            primaryTypographyProps={{ fontSize: 13.5, color: "#ef4444", fontWeight: 500 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth, boxSizing: "border-box",
            bgcolor: sidebarBg, borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth, boxSizing: "border-box",
            bgcolor: sidebarBg, borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

Sidebar.propTypes = {
  window: PropTypes.func,
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default Sidebar;
