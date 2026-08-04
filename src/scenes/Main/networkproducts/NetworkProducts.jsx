import { useMemo, useState } from "react";
import { Box, Typography, Card, Grid, Alert, Link as MuiLink, Fade } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { mtc } from "../../../theme/theme";
import RouterRoundedIcon from "@mui/icons-material/RouterRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { categories, categoryById } from "./data/categories";
import { allPackages, productSources } from "./data/mtcProducts";
import { brandAssets } from "./data/branding";
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
          background: `radial-gradient(circle, ${mtc.glow} 0%, transparent 70%)`,
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
            <RouterRoundedIcon sx={{ fontSize: { xs: 24, sm: 27, md: 30 }, color: isDark ? "#fff" : mtc.blue[700] }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography sx={{ fontSize: { xs: 24, sm: 29, md: 34 }, fontWeight: 800, letterSpacing: "-0.02em", color: isDark ? "#fff" : "#0c2a63" }}>
              Network Products
            </Typography>
            <Typography sx={{ fontSize: { xs: 13, sm: 14 }, color: isDark ? "rgba(255,255,255,0.75)" : "#33538f", mt: 0.5, maxWidth: 560 }}>
              GRIDx has partnered with MTC to bring connectivity to your doorstep — mobile data, Air Fibre wireless
              broadband, and Fibre, all in one place.
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 1,
          mt: { xs: 2, sm: 2.5 }, pt: { xs: 1.5, sm: 2 },
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(12,42,99,0.12)"}`,
        }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.55)" : "rgba(12,42,99,0.55)" }}>
            In partnership with
          </Typography>
          <Box component="img" src={brandAssets.mtcLogo} alt="MTC" sx={{ height: { xs: 16, sm: 18 }, width: "auto", opacity: 0.95 }} />
        </Box>
      </Card>

      <Alert icon={<InfoOutlinedIcon />} severity="info" sx={{ mb: { xs: 2.5, sm: 3 }, fontSize: { xs: 12.5, sm: 13.5 } }}>
        Pricing below is compiled from publicly available MTC information and may not reflect active promotions
        or regional availability. Packages marked <strong>"Confirm price"</strong> should be verified against{" "}
        <MuiLink href="https://www.mtc.com.na" target="_blank" rel="noopener">mtc.com.na</MuiLink> before being
        quoted to a customer.
      </Alert>

      <CategoryFilters categories={categories} active={activeCategory} onChange={setActiveCategory} />

      {activeCategory !== "mobile" && (
        <Card sx={{
          mb: { xs: 2.5, sm: 3 }, p: { xs: 2.5, sm: 3 }, overflow: "hidden",
          display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center",
          gap: { xs: 2.5, sm: 3 },
          background: isDark
            ? "linear-gradient(120deg, #0a1740 0%, #0d1f52 100%)"
            : "linear-gradient(120deg, #eef4ff 0%, #dbe8ff 100%)",
        }}>
          <Box sx={{
            flexShrink: 0, width: { xs: "100%", sm: 220 }, borderRadius: 3, p: 2,
            bgcolor: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
          }}>
            <Box component="img" src={brandAssets.spectraLogo} alt="MTC Spectra" sx={{ width: "100%", maxWidth: 190, height: "auto" }} />
            <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#0a1740", letterSpacing: "0.03em", textAlign: "center" }}>
              NOW AVAILABLE THROUGH GRIDx
            </Typography>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: { xs: 15, sm: 16 }, fontWeight: 800, color: isDark ? "#fff" : "#0a1740", mb: 0.5 }}>
              Official MTC Spectra pricing, verified
            </Typography>
            <Typography sx={{ fontSize: { xs: 12.5, sm: 13 }, color: isDark ? "rgba(255,255,255,0.7)" : "#33538f", mb: 2, maxWidth: 480 }}>
              The 10-75 Mbps Spectra Home tiers below are cross-checked against MTC's own official pricing flyer —
              every 36-month price shown matches exactly.
            </Typography>
            <Box
              component="a"
              href={brandAssets.spectraPricingFlyer}
              target="_blank"
              rel="noopener"
              sx={{
                display: "inline-flex", alignItems: "center", gap: 1.25, p: 1, pr: 2, borderRadius: 2.5,
                bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(10,23,64,0.12)"}`,
                textDecoration: "none", transition: "transform 0.15s ease",
                "&:hover": { transform: "translateY(-1px)" },
              }}
            >
              <Box component="img" src={brandAssets.spectraPricingFlyer} alt="Official MTC Spectra Home pricing flyer" sx={{
                width: 44, height: 44, objectFit: "cover", borderRadius: 1.5,
              }} />
              <Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: isDark ? "#fff" : "#0a1740" }}>
                  View official pricing flyer
                </Typography>
                <Typography sx={{ fontSize: 10.5, color: isDark ? "rgba(255,255,255,0.6)" : "#5b6d9e" }}>
                  Opens full-size in a new tab
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      )}

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
          <Typography>No packages in this category yet.</Typography>
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
