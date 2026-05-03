import { useState, useContext } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Badge from "@mui/material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Alert, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme/theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ElectricMeterOutlinedIcon from "@mui/icons-material/ElectricMeterOutlined";
import DynamicWifiIcon from "./components/DynamicWifiIcon";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useData } from "../Data/getData";
import AssessmentIcon from "@mui/icons-material/Assessment";

import { useNotificationData } from "../Data/getNotificationsData";
import AuthContext from "../../../context/AuthContext";

const drawerWidth = "240px";
// Generates a random integer between 0 and 100 (inclusive)
// const wifipercentage = 0

// function BadgeColor({
//   NotificationsWarning,
//   NotificationsCritical,
//   NotificationsInfo,
// }) {
//   if (NotificationsWarning.length + NotificationsCritical.length > 0) {
//     return "error";
//   } else if (NotificationsInfo.length > 0) {
//     return "primary";
//   } else {
//     return "success";
//   }
// }

function TopBar(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNoti, setAnchorElNoti] = useState(null);
  const [anchorElMobileNoti, setAnchorElMobileNoti] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const { notifications } = useNotificationData();
  const { signalStrengthData } = useData();
  const { HandleLogOut } = useContext(AuthContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const notificationsCount =
    notifications.length !== undefined ? notifications.length : 0;

  const styles = {
    drawerPaper: {
      backgroundColor: colors.primary[300], // Set your desired background color here
    },
  };

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
      transformorigin={{
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
              backgroundColor: colors.greenT[400],
              "&:hover": { backgroundColor: colors.greenT[400] },
            }}
          >
            <Typography textAlign="center">Notifications</Typography>
          </MenuItem>
          {notifications.map((notifications, index) => (
            <MenuItem key={index}>
              <Alert
                key={index}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap", // This ensures the text stays in one line
                }}
              >
                {notifications.Alarm}
                {/* {notifications.date_time}
            {notifications.DRN} */}
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

  /*Start of mobile notification menu*/
  const renderMobileNotiMenu = (
    <Menu
      sx={{
        mt: "20px",
      }}
      id="menu-appbar"
      anchorEl={anchorElMobileNoti}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformorigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorElMobileNoti)}
      onClose={handleMobileCloseNotiMenu}
    >
      {notificationsCount > 0 && (
        <MenuItem
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.greenT[400],
            "&:hover": { backgroundColor: colors.greenT[400] },
          }}
        >
          <Typography textAlign="center">Notifications</Typography>
        </MenuItem>
      )}
      {notifications.map((notification, index) => (
        <MenuItem key={index}>
          <Alert
            key={index}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap", // This ensures the text stays in one line
            }}
          >
            {notifications.Alarm}
            {/* {notifications.date_time}
            {notifications.DRN} */}
          </Alert>
        </MenuItem>
      ))}
    </Menu>
  );
  /*end of mobile notification menu*/

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={colorMode.toggleColorMode}>
        <IconButton>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon style={{ color: colors.primary[200] }} />
          ) : (
            <LightModeOutlinedIcon style={{ color: colors.primary[200] }} />
          )}
        </IconButton>
        <Typography>Theme</Typography>
      </MenuItem>
      {/* Notifications Icon */}
      {/* Notifications Icon */}
      <MenuItem onClick={handleMobileOpenNotiMenu}>
        <IconButton size="large" color="inherit">
          <Badge
            badgeContent={notificationsCount > 0 ? notificationsCount : null}
            color="error"
          >
            <NotificationsIcon style={{ color: colors.primary[200] }} />
          </Badge>
        </IconButton>
        <Typography>Notifications</Typography>
      </MenuItem>
      {renderMobileNotiMenu}
      {/* Notifications Icon */}
      {/* Notifications Icon */}

      <MenuItem>
        <Tooltip
          title={
            signalStrengthData === 0
              ? "No Signal"
              : `Signal Strength: ${signalStrengthData}%`
          }
        >
          <IconButton size="large" aria-label="Wifi" color="inherit">
            <DynamicWifiIcon />
          </IconButton>
        </Tooltip>
        <Typography>Signal</Typography>
      </MenuItem>
      <MenuItem onClick={HandleLogOut}>
        <Tooltip title="Log Out">
          <IconButton>
            <LogoutOutlinedIcon style={{ color: colors.primary[200] }} />
          </IconButton>
        </Tooltip>
        <Typography>Log Out</Typography>
      </MenuItem>
    </Menu>
  );

  const drawer = (
    <div>
      <br />
      <Typography
        textAlign="center"
        variant="h4"
        style={{ color: colors.primary[100] }}
      >
        GRIDx Portal
      </Typography>
      <br />
      <Divider />

      <List>
        <Box>
          <Link
            component={RouterLink}
            to="/"
            underline="none"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="DashBoard"
                  style={{ color: colors.primary[100] }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </Box>

        <Box>
          <Link
            component={RouterLink}
            to="/analysis"
            underline="none"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Analysis"
                  style={{ color: colors.primary[100] }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </Box>

        <Box>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <ElectricMeterOutlinedIcon />
              </ListItemIcon>
              <Link
                to="/meter"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItemText
                  primary="Meter Configurations"
                  style={{ color: colors.primary[100] }}
                />
              </Link>
            </ListItemButton>
          </ListItem>
        </Box>
        {/* <Box>
          <Link to="/wifi" sx={{ textDecoration: 'none' }}>
            <ListItem>
              <ListItemButton >
                <ListItemIcon>
                  <WifiOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Wifi Settings"
                  style={{ color: colors.primary[100] }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </Box> */}
        <Divider />

        <Box>
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  style={{ color: colors.primary[100] }}
                  primary="Profile"
                />
              </ListItemButton>
            </ListItem>
          </Link>
        </Box>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: colors.primaryT[400],
          height: "60px",
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
            <MenuIcon style={{ color: colors.primary[100] }} />
          </IconButton>
          <Typography
            style={{ color: colors.primary[100] }}
            variant="h4"
            noWrap
            component="div"
          >
            GRIDx
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon style={{ color: colors.primary[100] }} />
              ) : (
                <LightModeOutlinedIcon style={{ color: colors.primary[100] }} />
              )}
            </IconButton>
            {/* Notifications Icon */}

            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleOpenNotiMenu}
              // onMouseEnter={handleOpenNotiMenu}
            >
              <Badge
                badgeContent={
                  // notificationsCount > 0 ? notificationsCount : null
                  10
                }
                color="error"
              >
                <NotificationsIcon style={{ color: colors.primary[100] }} />
              </Badge>
            </IconButton>
            {renderNotiMenu}
            {/* Notifications Icon */}
            {/* Notifications Icon */}

            {/* <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle style={{ color: colors.primary[100] }} />
            </IconButton> */}
            <Tooltip
              title={
                signalStrengthData === 0
                  ? "No Signal"
                  : `Signal Strength: ${signalStrengthData}%`
              }
            >
              <IconButton size="large" aria-label="Wifi" color="inherit">
                <DynamicWifiIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Log Out">
              <IconButton onClick={HandleLogOut}>
                <LogoutOutlinedIcon style={{ color: colors.primary[200] }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon style={{ color: colors.primary[100] }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          backgroundColor: `${colors.primaryT[300]}`,
        }}
        aria-label="mailbox folders"
      >
        {/* Mobile drawer */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          PaperProps={{ style: styles.drawerPaper }}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* pc drawer */}
        <Drawer
          variant="permanent"
          PaperProps={{ style: styles.drawerPaper }}
          sx={{
            display: { xs: "none", sm: "block" },

            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {renderMobileMenu}
    </Box>
  );
}

TopBar.propTypes = {
  window: PropTypes.func,
};

export default TopBar;
