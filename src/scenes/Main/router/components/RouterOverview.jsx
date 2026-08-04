import React from "react";
import { Box, Grid } from "@mui/material";
import { InfoCard, Field, formatUptime } from "./shared";

const RouterOverview = ({ snapshot }) => {
  const { system, cellular } = snapshot;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <InfoCard title="System" subtitle="Router hardware & firmware">
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Field label="Hardware Version" value={system.hardwareVersion} mono />
            <Field label="Firmware Version" value={system.softwareVersion} mono />
            <Field label="Work Mode" value={system.workMode} />
            <Field label="Uptime" value={formatUptime(system.uptimeSeconds)} />
          </Box>
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <InfoCard title="Cellular" subtitle={cellular.moduleModel}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Field label="Network Mode" value={cellular.networkMode} />
            <Field label="Band" value={cellular.band} />
            <Field label="Carrier" value={cellular.carrier} />
            <Field label="APN" value={cellular.apn} mono />
            <Field label="RSRP / RSRQ" value={`${cellular.rsrp} / ${cellular.rsrq} dBm`} mono />
            <Field label="RSSI / SINR" value={`${cellular.rssi} dBm / ${cellular.sinr} dB`} mono />
          </Box>
        </InfoCard>
      </Grid>
    </Grid>
  );
};

export default RouterOverview;
