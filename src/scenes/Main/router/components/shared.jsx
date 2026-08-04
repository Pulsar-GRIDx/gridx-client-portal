import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const InfoCard = ({ title, subtitle, children, action }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box
      sx={{
        p: 2.5, borderRadius: 2, height: "100%",
        bgcolor: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: isDark ? "#f1f5f9" : "#0f172a" }}>{title}</Typography>
          {subtitle && <Typography sx={{ fontSize: 11.5, color: isDark ? "#64748b" : "#94a3b8", mt: 0.25 }}>{subtitle}</Typography>}
        </Box>
        {action}
      </Box>
      {children}
    </Box>
  );
};

export const Field = ({ label, value, mono }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Box>
      <Typography sx={{ fontSize: 10.5, color: isDark ? "#64748b" : "#94a3b8" }}>{label}</Typography>
      <Typography sx={{
        fontSize: 13, fontWeight: 600, mt: 0.25, color: isDark ? "#e2e8f0" : "#1e293b",
        fontFamily: mono ? "monospace" : "inherit",
      }}>
        {value}
      </Typography>
    </Box>
  );
};

export function formatUptime(totalSeconds) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours || days) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}
