import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../../theme/theme";
import { useData } from "../../../Data/getData";
import { Card, CardContent } from "@mui/material";

/**
 * UserInfo displays user information in a styled card.
 * It shows details like the user's name, email, address, meter number, and profile ID.
 *
 * @memberof ProfileDashboard.ProfileDashboard_components
 * @component
 * @returns {JSX.Element} Rendered UserInfo component
 */
const UserInfo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userData } = useData();

  return (
    <Box m={5}>
      <Card
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: `${colors.primaryT[400]}`, // Adjust background color here
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" color={colors.primary[100]} gutterBottom>
                {userData.FirstName} {userData.LastName}
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" color={colors.primary[100]} gutterBottom>
                {userData.Email}
              </Typography>
              <Typography
                variant="body1"
                color={colors.primary[100]}
                gutterBottom
              >
                {userData.countryName}, {userData.cityName},{" "}
                {userData.streetName}
              </Typography>
              <Typography
                variant="body1"
                color={colors.primary[100]}
                gutterBottom
              >
                Meter Number: {userData.DRN}
              </Typography>
              <Typography variant="body1" color={colors.primary[100]}>
                Profile ID: {userData.UserID}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserInfo;
