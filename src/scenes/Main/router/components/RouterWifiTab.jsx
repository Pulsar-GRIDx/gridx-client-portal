import React from "react";
import { Box, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { InfoCard, Field } from "./shared";

const RouterWifiTab = ({ snapshot }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { wifi, clients } = snapshot;
  const wirelessClients = clients.filter((c) => c.wireless);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <InfoCard title="Wi-Fi Radios">
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Field label="2.4GHz SSID" value={wifi.ssid2g} />
            <Field label="5GHz SSID" value={wifi.ssid5g || "Not broadcasting"} />
            <Field label="Connected Clients" value={String(wifi.clientCount)} />
          </Box>
        </InfoCard>
      </Grid>
      <Grid item xs={12} md={7}>
        <InfoCard title="Wireless Clients" subtitle={`${wirelessClients.length} connected`}>
          {wirelessClients.length === 0 ? (
            <Typography sx={{ fontSize: 12, color: isDark ? "#64748b" : "#94a3b8" }}>No wireless clients connected.</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["IP", "MAC", "Signal"].map((h) => (
                    <TableCell key={h} sx={{ fontSize: 10.5, fontWeight: 700, color: isDark ? "#64748b" : "#94a3b8", border: "none", px: 0 }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {wirelessClients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell sx={{ fontSize: 12, fontFamily: "monospace", border: "none", px: 0, color: isDark ? "#e2e8f0" : "#1e293b" }}>{c.ip}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: "monospace", border: "none", px: 0, color: isDark ? "#94a3b8" : "#64748b" }}>{c.mac}</TableCell>
                    <TableCell sx={{ fontSize: 12, fontFamily: "monospace", border: "none", px: 0, color: isDark ? "#94a3b8" : "#64748b" }}>{c.rssi} dBm</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
};

export default RouterWifiTab;
