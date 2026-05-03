import { useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "../scenes/Main/global/TopBar";
import Sidebar from "../scenes/Main/global/SideBar";
import { Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "../scenes/Main/dashboard/DashBoard";
import Metertokendash from "../scenes/Main/newtoken/metertokendash";
import ProfileDash from "../scenes/Main/profile/profiledash";
import WifiSettingsDash from "../scenes/Main/wifisettings/wifiSettingsDash";
import NotFound from "./NotFound";
import DataProvider from "../scenes/Main/Data/getData";
import NotificationDataProvider from "../scenes/Main/Data/getNotificationsData";
import AnalysisDash from "../scenes/Main/analysis/AnalysisDash";

/**
 * @module Routes
 */

/**
 * MainRoutes component sets up the primary routes and layout for the application.
 * It includes the sidebar, topbar, and the main content area which changes based on the route.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const MainRoutes = () => {
  /**
   * Ref for storing the window width.
   * @type {React.MutableRefObject<number>}
   */
  const windowWidth = useRef(window.innerWidth);
  const adjustedWidth = windowWidth.current - 240;

  /**
   * Ref for storing the window height.
   * @type {React.MutableRefObject<number>}
   */
  const windowHeight = useRef(window.innerHeight);
  const adjustedHeight = windowHeight.current - 60;

  /**
   * State for managing the mobile drawer's open status.
   * @type {[boolean, Function]}
   */
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * Toggles the state of the mobile drawer.
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <DataProvider>
      <CssBaseline />
      <NotificationDataProvider>
        <Box sx={{ display: "flex" }}>
          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
          <Box
            sx={{
              flexGrow: 1,
              height: "100vh",
              overflowY: "hidden",
              p: 3,
            }}
          >
            <Topbar handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ p: 3, mt: 3 }}>
              <Routes>
                <Route path="/" exact element={<Dashboard />} />
                <Route path="/meter" exact element={<Metertokendash />} />
                <Route path="/profile" exact element={<ProfileDash />} />
                <Route path="/wifi" exact element={<WifiSettingsDash />} />
                <Route path="/analysis" exact element={<AnalysisDash />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
          </Box>
        </Box>
      </NotificationDataProvider>
    </DataProvider>
  );
};

export default MainRoutes;
