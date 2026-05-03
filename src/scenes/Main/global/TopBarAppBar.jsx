import { useState, useContext } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { Alert, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme/theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DynamicWifiIcon from "./components/DynamicWifiIcon";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useData } from "../Data/getData";
import { useNotificationData } from "../Data/getNotificationsData";
import AuthContext from "../../../context/AuthContext";

const drawerWidth = 240;

/**
 * TopBar component that renders the top navigation bar with menu items, notifications, and theme toggle.
 *
 * @component
 * @example
 * const handleDrawerToggle = () => {
 *   // handle drawer toggle logic
 * };
 * return (
 *   <TopBar handleDrawerToggle={handleDrawerToggle} />
 * );
 *
 * @param {Object} props - The props for the TopBar component.
 * @param {function} props.handleDrawerToggle - A function to handle the toggling of the drawer.
 *
 * @returns {JSX.Element} The rendered TopBar component.
 */
function TopBar({ handleDrawerToggle }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNoti, setAnchorElNoti] = useState(null);
  const [anchorElMobileNoti, setAnchorElMobileNoti] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const { notifications } = useNotificationData();
  const { signalStrengthData } = useData();
  const { HandleLogOut } = useContext(AuthContext);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpenNotiMenu = (event) => {
    setAnchorElNoti(event.currentTarget);
  };

  const handleCloseNotiMenu = () => {
    setAnchorElNoti(null);
  };

  const handleMobileOpenNotiMenu = (event) => {
    setAnchorElMobileNoti(event.currentTarget);
  };

  const handleMobileCloseNotiMenu = () => {
    setAnchorElMobileNoti(null);
  };

  const handleLogout = () => {
    HandleLogOut();
  };

  const notificationsCount =
    notifications.length !== undefined ? notifications.length : 0;

  const renderNotiMenu = (
    <Menu
      sx={{
        mt: "50px",
        maxWidth: "35%",
        maxHeight: "65%",
        minWidth: "22%",
      }}
      id="menu-appbar"
      anchorEl={anchorElNoti}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorElNoti)}
      onClose={handleCloseNotiMenu}
    >
      {notificationsCount > 0 ? (
        <>
          <MenuItem
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.green[400],
              "&:hover": { backgroundColor: colors.green[400] },
            }}
          >
            <Typography textAlign="center">Notifications</Typography>
          </MenuItem>
          {notifications.map((notification, index) => (
            <MenuItem key={index}>
              <Alert
                key={index}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {notification.Alarm}
              </Alert>
            </MenuItem>
          ))}
        </>
      ) : (
        <MenuItem>
          <Alert severity="info">No notifications present.</Alert>
        </MenuItem>
      )}
    </Menu>
  );

  const renderMobileNotiMenu = (
    <Menu
      sx={{
        mt: "50px",
        maxWidth: "80%",
        maxHeight: "70%",
        minWidth: "60%",
      }}
      id="menu-appbar"
      anchorEl={anchorElMobileNoti}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorElMobileNoti)}
      onClose={handleMobileCloseNotiMenu}
    >
      {notificationsCount > 0 ? (
        <>
          <MenuItem
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: colors.green[400],
              "&:hover": { backgroundColor: colors.green[400] },
            }}
          >
            <Typography textAlign="center">Notifications</Typography>
          </MenuItem>
          {notifications.map((notification, index) => (
            <MenuItem key={index}>
              <Alert
                key={index}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {notification.Alarm}
              </Alert>
            </MenuItem>
          ))}
        </>
      ) : (
        <MenuItem>
          <Alert severity="info">No notifications present.</Alert>
        </MenuItem>
      )}
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMobileOpenNotiMenu}>
        <IconButton
          size="large"
          aria-label="show new notifications"
          color="inherit"
        >
          <Badge badgeContent={notificationsCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={colorMode.toggleColorMode}>
        <IconButton size="large" color="inherit">
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <p>{theme.palette.mode === "dark" ? "Dark Mode" : "Light Mode"}</p>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <IconButton size="large" aria-label="logout" color="inherit">
          <LogoutOutlinedIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="Fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: colors.primary[300],
          height:"60px"
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <DynamicWifiIcon strength={signalStrengthData.strength} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            GRIDx Portal
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              aria-label="show new notifications"
              color="inherit"
              onClick={handleOpenNotiMenu}
            >
              <Badge badgeContent={notificationsCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={colorMode.toggleColorMode}
            >
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
              ) : (
                <LightModeOutlinedIcon />
              )}
            </IconButton>
            <IconButton
              size="large"
              aria-label="logout"
              color="inherit"
              onClick={handleLogout}
            >
              <Tooltip title="Logout">
                <LogoutOutlinedIcon />
              </Tooltip>
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderNotiMenu}
      {renderMobileNotiMenu}
    </Box>
  );
}

TopBar.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default TopBar;
