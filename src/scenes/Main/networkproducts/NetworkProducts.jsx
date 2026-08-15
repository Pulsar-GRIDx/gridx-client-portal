import { useMemo, useState } from "react";
import { Box, Typography, Card, Grid, Alert, Link as MuiLink, Fade } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// The shared portal palette is still exported under its original name in
// theme.js, which other pages depend on. Aliased here so this page carries no
// stale partner naming without touching the shared theme.
import { mtc as brandPalette } from "../../../theme/theme";
import RouterRoundedIcon from "@mui/icons-material/RouterRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { categories, categoryById } from "./data/categories";
import { allPackages, productSources } from "./data/africaOnlineProducts";
import { brandAssets, AFRICA_ONLINE } from "./data/branding";
import CategoryFilters from "./components/CategoryFilters";
import PackageCard from "./components/PackageCard";
import ComparisonTable from "./components/ComparisonTable";

export default function NetworkProducts() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPackages = useMemo(
    () => (activeCategory === "all" ? allPackages : allPackages.filter((p) => p.category === activeCategory)),
    [activeCategory],
  );

  return (
    <Box sx={{ minWidth: 0, maxWidth: "100%" }}>
      {/* Hero */}
      <Card sx={{
        p: { xs: 2.5, sm: 3.5, md: 4 }, mb: { xs: 2.5, sm: 3 }, position: "relative", overflow: "hidden",
        background: isDark
          ? "linear-gradient(135deg, #0c1631 0%, #0a3fb0 140%)"
          : "linear-gradient(135deg, #eef4ff 0%, #dbe8ff 140%)",
      }}>
        <Box sx={{
          position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%",
          background: `radial-gradient(circle, ${brandPalette.glow} 0%, transparent 70%)`,
        }} />
        <Box sx={{
          position: "absolute", bottom: -80, left: "30%", width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.16) 0%, transparent 70%)",
        }} />
        <Box sx={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, flexWrap: "wrap" }}>
          <Box sx={{
            width: { xs: 46, sm: 52, md: 56 }, height: { xs: 46, sm: 52, md: 56 }, borderRadius: 3, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
          }}>
            <RouterRoundedIcon sx={{ fontSize: { xs: 24, sm: 27, md: 30 }, color: isDark ? "#fff" : brandPalette.blue[700] }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography sx={{ fontSize: { xs: 24, sm: 29, md: 34 }, fontWeight: 800, letterSpacing: "-0.02em", color: isDark ? "#fff" : "#0c2a63" }}>
              Network Products
            </Typography>
            <Typography sx={{ fontSize: { xs: 13, sm: 14 }, color: isDark ? "rgba(255,255,255,0.75)" : "#33538f", mt: 0.5, maxWidth: 580 }}>
              GRIDx has partnered with Africa Online to bring connectivity to your doorstep — fibre, Jet fixed
              wireless, LTE and VSAT, plus the cloud and managed services that sit behind them.
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 1.25,
          mt: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 }, flexWrap: "wrap",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(12,42,99,0.12)"}`,
        }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.55)" : "rgba(12,42,99,0.55)" }}>
            In partnership with
          </Typography>
          {/* The wordmark is transparent-background but dark navy ink, so on the
              dark hero it needs a light chip behind it to stay legible. Padding
              is asymmetric because the asset carries its own small margin. */}
          <Box sx={{
            display: "inline-flex", alignItems: "center", borderRadius: 1.5,
            px: 1, py: 0.6, bgcolor: isDark ? "rgba(255,255,255,0.92)" : "transparent",
          }}>
            <Box
              component="img"
              src={brandAssets.africaOnlineLogo}
              alt={`${AFRICA_ONLINE.name} — ${AFRICA_ONLINE.tagline}`}
              sx={{ height: { xs: 20, sm: 24 }, width: "auto", display: "block" }}
            />
          </Box>
        </Box>
      </Card>

      <Alert icon={<InfoOutlinedIcon />} severity="info" sx={{ mb: { xs: 2.5, sm: 3 }, fontSize: { xs: 12.5, sm: 13.5 } }}>
        Pricing below is taken from {AFRICA_ONLINE.name}'s own published product pages and may not reflect active
        promotions, regional availability or site-specific installation costs. Products shown as{" "}
        <strong>"Pricing on request"</strong> are quoted per proposal. Confirm against{" "}
        <MuiLink href={AFRICA_ONLINE.productsUrl} target="_blank" rel="noopener">africaonline.com.na</MuiLink>{" "}
        before quoting a customer.
      </Alert>

      <CategoryFilters categories={categories} active={activeCategory} onChange={setActiveCategory} />

      <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
        {filteredPackages.map((pkg) => (
          <Fade in key={pkg.id} timeout={400}>
            <Grid item xs={12} sm={6} lg={4} xl={3}>
              <PackageCard pkg={pkg} category={categoryById[pkg.category]} />
            </Grid>
          </Fade>
        ))}
      </Grid>

      {filteredPackages.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <Typography>No products in this category yet.</Typography>
        </Box>
      )}

      <ComparisonTable packages={allPackages} />

      <Box sx={{ mt: 5 }}>
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
