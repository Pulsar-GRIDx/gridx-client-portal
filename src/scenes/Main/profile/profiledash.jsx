import React from "react";
import UserInfo from "./components/userProfile/userinfo";
import { Divider, Grid, Typography } from "@mui/material";
import MeterProfile from "./components/meterProfile/meterProfile";

/**
 * @module ProfileDashboard
 */

/**
 * @namespace ProfileDashboard.ProfileDashboard_components
 */

/**
 * The ProfileDash component renders the profile page layout.
 *
 * @component
 * @example
 * return <ProfileDash />;
 *
 * @returns {JSX.Element} The rendered profile dashboard component.
 */
const ProfileDash = () => {
  console.log("ProfileDash component rendering");
  return (
    <div
      style={{
        padding: "20px",
        overflowY: "scroll",
        maxHeight: "95vh",
        pb: "10vh",
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography variant="h2" m={1}>
            Profile page
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={0} sm={0} md={2} lg={3} xl={3}>
          {/* Placeholder grid item for layout adjustment */}
        </Grid>

        <Grid item xs={12} sm={12} md={8} lg={6} xl={6}>
          <UserInfo />
        </Grid>

        <Grid item xs={0} sm={0} md={2} lg={3} xl={3}>
          {/* Placeholder grid item for layout adjustment */}
        </Grid>

        <Grid item xs={0} sm={0} md={2} lg={3} xl={3}>
          {/* Placeholder grid item for layout adjustment */}
        </Grid>

        <Grid item xs={12} sm={12} md={8} lg={6} xl={6}>
          <MeterProfile />
        </Grid>

        <Grid item xs={0} sm={0} md={2} lg={3} xl={3}>
          {/* Placeholder grid item for layout adjustment */}
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* Placeholder grid item for layout adjustment */}
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          {/* Placeholder grid item for layout adjustment */}
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileDash;
