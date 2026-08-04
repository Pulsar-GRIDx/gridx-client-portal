import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { InfoCard, Field } from "./shared";

const RouterSecurityTab = ({ snapshot }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { security } = snapshot;

  return (
    <Grid container spacing={2}>
      {security.unauthenticatedReadApi && (
        <Grid item xs={12}>
          <Box sx={{
            p: 2, borderRadius: 2, display: "flex", gap: 1.5,
            bgcolor: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.06)",
            border: `1px solid ${isDark ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.2)"}`,
          }}>
            <ShieldOutlinedIcon sx={{ color: "#ef4444", fontSize: 20, mt: 0.25 }} />
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>
                Known issue on this router's firmware
              </Typography>
              <Typography sx={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b", mt: 0.5 }}>
                This router answers status requests — including its Wi-Fi password — with no login check at all,
                to any device on its network. This is a limitation of the router's own base firmware, not something
                this portal introduced or can fix from here.
              </Typography>
            </Box>
          </Box>
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        <InfoCard title="Remote Web Management">
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Field label="Status" value={security.remoteManagementEnabled ? "Enabled" : "Disabled"} />
            <Field label="Port" value={security.remoteManagementPort ? String(security.remoteManagementPort) : "—"} mono />
          </Box>
        </InfoCard>
      </Grid>
    </Grid>
  );
};

export default RouterSecurityTab;
