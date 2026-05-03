import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ElectricMeterOutlinedIcon from "@mui/icons-material/ElectricMeterOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme/theme";

const drawerWidth = 240;

/**
 * Sidebar component that renders a navigation drawer with links to different sections.
 *
 * @component
 * @example
 * const handleDrawerToggle = () => {
 *   // handle drawer toggle logic
 * };
 * return (
 *   <Sidebar window={window} mobileOpen={true} handleDrawerToggle={handleDrawerToggle} />
 * );
 *
 * @param {Object} props - The props for the Sidebar component.
 * @param {function} props.window - A function that returns the window object, used for container property.
 * @param {boolean} props.mobileOpen - A boolean to determine if the mobile drawer is open.
 * @param {function} props.handleDrawerToggle - A function to handle the toggling of the drawer.
 *
 * @returns {JSX.Element} The rendered Sidebar component.
 */
function Sidebar({ window, mobileOpen, handleDrawerToggle }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
          <RouterLink to="/" sx={{ textDecoration: "none", color: "inherit" }}>
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <HomeOutlinedIcon sx={{ color: colors.primary[100] }} />
                </ListItemIcon>
                <ListItemText
                  primary="DashBoard"
                  sx={{ color: colors.primary[100] }}
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
        </Box>

        <Box>
          <RouterLink
            to="/analysis"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <AssessmentIcon sx={{ color: colors.primary[100] }} />
                </ListItemIcon>
                <ListItemText
                  primary="Analysis"
                  sx={{ color: colors.primary[100] }}
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
        </Box>

        <Box>
          <RouterLink
            to="/meter"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <ElectricMeterOutlinedIcon
                    sx={{ color: colors.primary[100] }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Meter Configurations"
                  sx={{ color: colors.primary[100] }}
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
        </Box>
        <Divider />

        <Box>
          <RouterLink
            to="/profile"
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItem>
              <ListItemButton>
                <ListItemIcon>
                  <AccountCircleOutlinedIcon
                    sx={{ color: colors.primary[100] }}
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{ color: colors.primary[100] }}
                  primary="Profile"
                />
              </ListItemButton>
            </ListItem>
          </RouterLink>
        </Box>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        backgroundColor: colors.primaryT[400],
        height: "100vh",
      }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
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
      {/* PC drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
          backgroundColor: colors.primaryT[400],
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
