import { useState } from "react";
import {
  Box, Typography, Card, Grid, Chip, Tabs, Tab, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Link as MuiLink, Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { mtc } from "../../../theme/theme";
import RouterRoundedIcon from "@mui/icons-material/RouterRounded";
import SimCardRoundedIcon from "@mui/icons-material/SimCardRounded";
import SettingsInputAntennaRoundedIcon from "@mui/icons-material/SettingsInputAntennaRounded";
import CableRoundedIcon from "@mui/icons-material/CableRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { mobileDataPackages, spectraFibrePackages, productSources } from "./data/mtcProducts";

const TABS = { MOBILE: 0, SPECTRA: 1, FIBRE: 2 };

function SectionHeader({ icon, title, subtitle }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
      <Box sx={{
        width: 40, height: 40, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
        background: mtc.gradient, color: "#fff", flexShrink: 0,
        boxShadow: `0 6px 16px -4px ${mtc.glow}`,
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h3">{title}</Typography>
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      </Box>
    </Box>
  );
}

function UnverifiedBadge() {
  return (
    <Tooltip title="Publicly reported figure — confirm with MTC before publishing or quoting to customers.">
      <Chip
        icon={<WarningAmberRoundedIcon sx={{ fontSize: 14 }} />}
        label="Confirm price"
        size="small"
        sx={{ height: 20, fontSize: 10, bgcolor: "rgba(245,158,11,0.15)", color: "#f59e0b" }}
      />
    </Tooltip>
  );
}

function MobileDataGrid() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Grid container spacing={2.5}>
      {mobileDataPackages.map((pkg) => (
        <Grid item xs={12} sm={6} lg={3} key={pkg.id}>
          <Card sx={{
            p: 2.5, height: "100%", display: "flex", flexDirection: "column", position: "relative",
            ...(pkg.highlight && { border: `1.5px solid ${mtc.blue[500]}`, boxShadow: `0 0 0 3px ${mtc.glowSoft}` }),
          }}>
            {pkg.highlight && (
              <Chip label="Most Popular" size="small" sx={{
                position: "absolute", top: -11, left: 20, height: 22, fontSize: 10.5,
                background: mtc.gradient, color: "#fff",
              }} />
            )}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{pkg.name}</Typography>
              {!pkg.verified && <UnverifiedBadge />}
            </Box>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mb: 2 }}>
              <Typography sx={{ fontSize: 30, fontWeight: 800, color: isDark ? mtc.blue[300] : mtc.blue[600] }}>
                N${pkg.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">/ {pkg.period}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
              {[
                { label: `${pkg.data} data`, },
                { label: pkg.minutes },
                { label: pkg.sms },
              ].map((f, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 16, color: "#10b981" }} />
                  <Typography variant="body2">{f.label}</Typography>
                </Box>
              ))}
            </Box>
            {pkg.note && (
              <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 2, fontStyle: "italic" }}>
                {pkg.note}
              </Typography>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function SpectraFibreTable({ fibreOnly }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const rows = fibreOnly ? spectraFibrePackages.filter((p) => p.fibreOnly) : spectraFibrePackages;
  return (
    <Card sx={{ overflow: "hidden" }}>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Speed</TableCell>
              <TableCell align="right">12 Months</TableCell>
              <TableCell align="right">24 Months</TableCell>
              <TableCell align="right">36 Months</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={row.highlight ? { bgcolor: isDark ? "rgba(31,99,242,0.06)" : "rgba(13,79,219,0.03)" } : undefined}
              >
                <TableCell sx={{ fontWeight: 700 }}>
                  {row.speed}
                  {row.fibreOnly && (
                    <Chip label="Fibre only" size="small" sx={{ ml: 1, height: 18, fontSize: 9.5 }} />
                  )}
                </TableCell>
                <TableCell align="right">N${row.price12.toFixed(2)}</TableCell>
                <TableCell align="right">N${row.price24.toFixed(2)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? mtc.blue[300] : mtc.blue[600] }}>
                  N${row.price36.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  {row.verified ? (
                    <Tooltip title="Cross-confirmed across multiple public sources">
                      <CheckCircleRoundedIcon sx={{ fontSize: 16, color: "#10b981" }} />
                    </Tooltip>
                  ) : (
                    <UnverifiedBadge />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 2, borderTop: `1px solid ${isDark ? "rgba(148,163,184,0.1)" : "#eef1f6"}` }}>
        <Typography variant="body2" color="text.secondary">
          Unlimited data on all tiers. Free installation on 24 and 36-month contracts. Existing Spectra wireless
          customers are eligible for a free upgrade to Fibre where available in their area.
        </Typography>
      </Box>
    </Card>
  );
}

export default function NetworkProducts() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [tab, setTab] = useState(TABS.MOBILE);

  return (
    <Box>
      {/* Hero */}
      <Card sx={{
        p: { xs: 3, sm: 4 }, mb: 3, position: "relative", overflow: "hidden",
        background: isDark
          ? "linear-gradient(135deg, #0c1631 0%, #0a3fb0 140%)"
          : "linear-gradient(135deg, #eef4ff 0%, #dbe8ff 140%)",
      }}>
        <Box sx={{
          position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%",
          background: `radial-gradient(circle, ${mtc.glow} 0%, transparent 70%)`,
        }} />
        <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{
            width: 56, height: 56, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <RouterRoundedIcon sx={{ fontSize: 30, color: isDark ? "#fff" : mtc.blue[700] }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 240 }}>
            <Typography variant="h2" sx={{ color: isDark ? "#fff" : "#0c2a63" }}>
              Network Products
            </Typography>
            <Typography variant="body1" sx={{ color: isDark ? "rgba(255,255,255,0.75)" : "#33538f", mt: 0.5 }}>
              GRIDx has partnered with MTC to bring connectivity products to your doorstep — mobile data,
              wireless broadband, and fibre, all in one place.
            </Typography>
          </Box>
        </Box>
      </Card>

      <Alert
        icon={<InfoOutlinedIcon />}
        severity="info"
        sx={{ mb: 3 }}
      >
        Pricing below is compiled from publicly available MTC information and may not reflect active promotions
        or regional availability. Items marked <strong>"Confirm price"</strong> should be verified against{" "}
        <MuiLink href="https://www.mtc.com.na" target="_blank" rel="noopener">mtc.com.na</MuiLink> before being
        quoted to a customer.
      </Alert>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{
          mb: 3, minHeight: 40,
          "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600, fontSize: 13.5 },
          "& .MuiTabs-indicator": { background: mtc.gradient, height: 3, borderRadius: 3 },
        }}
      >
        <Tab icon={<SimCardRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Mobile Data" />
        <Tab icon={<SettingsInputAntennaRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Spectra Wireless" />
        <Tab icon={<CableRoundedIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Fibre" />
      </Tabs>

      {tab === TABS.MOBILE && (
        <Box>
          <SectionHeader
            icon={<SimCardRoundedIcon />}
            title="MTC Aweh — Mobile Data Packages"
            subtitle="Prepaid data, minutes and SMS bundles for everyday connectivity"
          />
          <MobileDataGrid />
        </Box>
      )}

      {tab === TABS.SPECTRA && (
        <Box>
          <SectionHeader
            icon={<SettingsInputAntennaRoundedIcon />}
            title="MTC Spectra — Wireless Broadband"
            subtitle="Fixed wireless internet for home and business, no phone line required"
          />
          <SpectraFibreTable fibreOnly={false} />
        </Box>
      )}

      {tab === TABS.FIBRE && (
        <Box>
          <SectionHeader
            icon={<CableRoundedIcon />}
            title="MTC Fibre"
            subtitle="High-speed fibre-to-the-home internet with unlimited data"
          />
          <SpectraFibreTable fibreOnly={false} />
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "text.secondary", textTransform: "uppercase", mb: 1 }}>
          Sources
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {productSources.map((s) => (
            <MuiLink key={s.url} href={s.url} target="_blank" rel="noopener" sx={{ fontSize: 12, color: "text.secondary" }}>
              {s.label}
            </MuiLink>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
