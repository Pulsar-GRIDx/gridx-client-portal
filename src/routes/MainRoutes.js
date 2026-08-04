import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Topbar from "../scenes/Main/global/TopBar";
import Sidebar from "../scenes/Main/global/SideBar";
import Dashboard from "../scenes/Main/dashboard/DashBoard";
import ProfileDash from "../scenes/Main/profile/profiledash";
import GeyserControl from "../scenes/Main/geyser/GeyserControl";
import Recharge from "../scenes/Main/recharge/Recharge";
import Statistics from "../scenes/Main/statistics/Statistics";
import NetMetering from "../scenes/Main/netmetering/NetMetering";
import Settings from "../scenes/Main/settings/Settings";
import DataUsage from "../scenes/Main/datausage/DataUsage";
import NetworkProducts from "../scenes/Main/networkproducts/NetworkProducts";
import RouterDash from "../scenes/Main/router/RouterDash";
import NotFound from "./NotFound";
import DataProvider from "../scenes/Main/Data/getData";
import NotificationDataProvider from "../scenes/Main/Data/getNotificationsData";

const drawerWidth = 264;

const MainRoutes = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <DataProvider>
      <CssBaseline />
      <NotificationDataProvider>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
          <Box sx={{
            flexGrow: 1,
            minWidth: 0, // classic flexbox trap: without this, a deep descendant with an
            // intrinsic min-width (e.g. a comparison table) silently forces this whole
            // column — and the page — wider than the viewport on narrow screens.
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: "100vh",
            overflowX: "hidden",
          }}>
            <Topbar handleDrawerToggle={handleDrawerToggle} />
            <Box sx={{ pt: 8, px: { xs: 2, sm: 3 }, pb: 2 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/geyser" element={<GeyserControl />} />
                <Route path="/recharge" element={<Recharge />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/net-metering" element={<NetMetering />} />
                <Route path="/profile" element={<ProfileDash />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/data-usage" element={<DataUsage />} />
                <Route path="/network-products" element={<NetworkProducts />} />
                <Route path="/router" element={<RouterDash />} />
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
