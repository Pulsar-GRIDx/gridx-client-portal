import React from "react";
import { Box, Grid } from "@mui/material";
import { InfoCard, Field } from "./shared";

const RouterNetworkTab = ({ snapshot }) => {
  const { network } = snapshot;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <InfoCard title="LAN" subtitle="Local network configuration">
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Field label="Router IP" value={network.lanIp} mono />
            <Field label="DHCP Server" value={network.dhcpEnabled ? "Enabled" : "Disabled"} />
            <Field label="Active Leases" value={String(network.leaseCount)} />
          </Box>
        </InfoCard>
      </Grid>
    </Grid>
  );
};

export default RouterNetworkTab;
