import { useState } from "react";
import {
  Box, Card, Typography, Chip, Divider, Collapse, ButtonBase,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import MemoryRoundedIcon from "@mui/icons-material/MemoryRounded";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import { CATEGORY } from "../data/categories";
import SpecRow from "./SpecRow";
import StatusBadge from "./StatusBadge";

// Africa Online publish a single corporate wordmark rather than per-product
// marks, so the category badge uses a Material icon per family instead of
// stretching one logo across three different product types.
const CATEGORY_ICON = {
  [CATEGORY.CONNECTIVITY]: <PublicRoundedIcon sx={{ fontSize: { xs: 22, sm: 24, md: 26 } }} />,
  [CATEGORY.HARDWARE]: <MemoryRoundedIcon sx={{ fontSize: { xs: 22, sm: 24, md: 26 } }} />,
  [CATEGORY.CLOUD]: <CloudRoundedIcon sx={{ fontSize: { xs: 22, sm: 24, md: 26 } }} />,
};

const FEATURES_COLLAPSED_COUNT = 3;
const TERMS = [12, 24, 36];

const fmtPrice = (n) => n.toLocaleString("en-NA", { maximumFractionDigits: 2 });

export default function PackageCard({ pkg, category }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = category.accent;
  const [term, setTerm] = useState(24);
  const [expanded, setExpanded] = useState(false);

  // Three pricing shapes across the Africa Online catalogue:
  //   byTerm  - LTE Infinity, the only product priced per contract length
  //   fixed   - a published "from" figure
  //   none    - Africa Online quotes on request; we show that rather than
  //             inventing a number (Dedicated Fibre, leased lines, hardware)
  const byTerm = pkg.priceByTerm != null;
  const price = byTerm ? pkg.priceByTerm[term] : pkg.price;
  const hasPrice = price != null;

  const specs = pkg.specs ?? [];
  const features = pkg.features ?? [];
  const extraFeatures = features.length - FEATURES_COLLAPSED_COUNT;

  return (
    <Card
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: { xs: 2.25, sm: 2.75, md: 3 },
        pt: { xs: 2.75, sm: 3.25, md: 3.5 },
        overflow: "visible",
        border: `1.5px solid ${pkg.statusBadge ? `${accent.solid}55` : theme.palette.mode === "dark" ? "rgba(148,163,184,0.12)" : "#e2e8f0"}`,
        background: isDark
          ? `linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 60%), radial-gradient(120% 100% at 0% 0%, ${accent.glowSoft} 0%, transparent 55%), #111a2e`
          : `linear-gradient(160deg, ${accent.glowSoft} 0%, rgba(255,255,255,0) 55%), #ffffff`,
        transition: "transform 0.28s cubic-bezier(.2,.8,.2,1), box-shadow 0.28s ease, border-color 0.28s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: `${accent.solid}90`,
          boxShadow: `0 24px 48px -18px ${accent.glow}`,
        },
      }}
    >
      <StatusBadge label={pkg.statusBadge} gradient={accent.gradient} />

      {/* Icon + verification chip */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{
          width: { xs: 44, sm: 48, md: 52 }, height: { xs: 44, sm: 48, md: 52 }, borderRadius: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: accent.gradient, color: "#fff", flexShrink: 0,
          boxShadow: `0 8px 20px -6px ${accent.glow}`,
        }}>
          {CATEGORY_ICON[pkg.category]}
        </Box>
        {!pkg.verified && (
          <Chip
            icon={<WarningAmberRoundedIcon sx={{ fontSize: "13px !important", color: "inherit" }} />}
            label="Confirm price"
            size="small"
            sx={{
              height: 22, fontSize: 10, fontWeight: 700,
              bgcolor: isDark ? "rgba(148,163,184,0.16)" : "rgba(100,116,139,0.12)",
              color: isDark ? "#cbd5e1" : "#475569",
            }}
          />
        )}
      </Box>

      {/* Title */}
      <Typography sx={{ fontSize: { xs: 18.5, sm: 20, md: 21 }, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1.15 }}>
        {pkg.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4, mb: 2 }}>
        {pkg.tagline}
      </Typography>

      {/* Headline capability chip (speed, capacity or scope depending on family) */}
      {pkg.headline && (
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<BoltRoundedIcon sx={{ fontSize: 15, color: `${isDark ? accent.light : accent.dark} !important` }} />}
            label={pkg.headline}
            sx={{
              fontWeight: 800, fontSize: 13, height: 32, px: 0.5, maxWidth: "100%",
              bgcolor: `${accent.solid}1a`, color: isDark ? accent.light : accent.dark,
            }}
          />
        </Box>
      )}

      {/* Price */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.6, mb: byTerm ? 1 : 0.5, flexWrap: "wrap" }}>
        {hasPrice ? (
          <>
            {pkg.priceFrom && (
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.secondary" }}>from</Typography>
            )}
            <Typography sx={{
              fontSize: { xs: 30, sm: 33, md: 36 }, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1,
              backgroundImage: accent.gradient, backgroundClip: "text", WebkitBackgroundClip: "text",
              color: "transparent",
            }}>
              N${fmtPrice(price)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {pkg.priceUnit}{pkg.exVat ? " ex VAT" : ""}
            </Typography>
          </>
        ) : (
          // No published figure — say so plainly rather than rendering "N$0".
          <Typography sx={{
            fontSize: { xs: 21, sm: 22, md: 23 }, fontWeight: 900, letterSpacing: "-0.01em", lineHeight: 1.2,
            backgroundImage: accent.gradient, backgroundClip: "text", WebkitBackgroundClip: "text",
            color: "transparent",
          }}>
            Pricing on request
          </Typography>
        )}
      </Box>

      {byTerm && (
        <Box sx={{ display: "flex", gap: 0.75, mb: 2.5, mt: 1 }}>
          {TERMS.map((t) => (
            <ButtonBase
              key={t}
              onClick={() => setTerm(t)}
              sx={{
                flex: 1, minHeight: 40, borderRadius: 2, fontSize: 12, fontWeight: 700,
                border: `1.5px solid ${t === term ? accent.solid : (isDark ? "rgba(148,163,184,0.2)" : "#e2e8f0")}`,
                color: t === term ? (isDark ? accent.light : accent.dark) : "text.secondary",
                bgcolor: t === term ? `${accent.solid}14` : "transparent",
                transition: "all 0.15s ease",
                "&:active": { transform: "scale(0.96)" },
              }}
            >
              {t}mo
            </ButtonBase>
          ))}
        </Box>
      )}

      <Divider sx={{ mt: byTerm ? 0 : 1.5, mb: 1 }} />

      {/* Spec rows — generic label/value pairs so a fibre tier list, a mailbox
          size table and a domain price list can all use the same component. */}
      {specs.length > 0 && (
        <>
          <Box sx={{ mb: 1 }}>
            {specs.map((s) => (
              <SpecRow
                key={s.label}
                icon={<ChevronRightRoundedIcon sx={{ fontSize: 13 }} />}
                label={s.label}
                value={s.value}
                accentColor={accent.solid}
                dense
              />
            ))}
          </Box>
          <Divider sx={{ mb: 1.5 }} />
        </>
      )}

      {/* Feature checklist */}
      <Box sx={{ mb: 2 }}>
        {features.slice(0, FEATURES_COLLAPSED_COUNT).map((f, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 0.6 }}>
            <CheckCircleRoundedIcon sx={{ fontSize: 15, color: accent.solid, mt: 0.1, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 12.5 }}>{f}</Typography>
          </Box>
        ))}
        {extraFeatures > 0 && (
          <>
            <Collapse in={expanded}>
              {features.slice(FEATURES_COLLAPSED_COUNT).map((f, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 0.6 }}>
                  <CheckCircleRoundedIcon sx={{ fontSize: 15, color: accent.solid, mt: 0.1, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 12.5 }}>{f}</Typography>
                </Box>
              ))}
            </Collapse>
            <ButtonBase
              onClick={() => setExpanded(!expanded)}
              sx={{
                display: "flex", alignItems: "center", gap: 0.4, mt: 0.4, py: 1, pr: 1, ml: -0.5,
                minHeight: 40, borderRadius: 1.5, color: accent.solid, fontSize: 12, fontWeight: 700,
              }}
            >
              {expanded ? "Show less" : `+${extraFeatures} more feature${extraFeatures > 1 ? "s" : ""}`}
              <ExpandMoreRoundedIcon sx={{ fontSize: 15, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
            </ButtonBase>
          </>
        )}
      </Box>

      {/* GRIDx recommendation panel */}
      {pkg.recommendedFor?.length > 0 && (
        <Box sx={{
          mb: 2.5, p: 1.5, borderRadius: 2,
          bgcolor: isDark ? "rgba(255,255,255,0.03)" : "rgba(15,23,42,0.03)",
          border: `1px dashed ${isDark ? "rgba(148,163,184,0.18)" : "#e2e8f0"}`,
        }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary", mb: 0.75 }}>
            GRIDx Recommends For
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {pkg.recommendedFor.map((r) => (
              <Chip key={r} label={r} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 600 }} />
            ))}
          </Box>
        </Box>
      )}

      {pkg.note && (
        <Typography sx={{ fontSize: 10.5, color: "text.secondary", fontStyle: "italic", mb: 2 }}>
          {pkg.note}
        </Typography>
      )}

      {/* CTA — deep-links to the specific Africa Online product page */}
      <ButtonBase
        component="a"
        href={pkg.href}
        target="_blank"
        rel="noopener"
        sx={{
          mt: "auto", width: "100%", minHeight: 48, py: 1.3, borderRadius: 2.5,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75,
          background: accent.gradient, color: "#fff", fontWeight: 700, fontSize: 13.5,
          boxShadow: `0 10px 24px -8px ${accent.glow}`,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          WebkitTapHighlightColor: "transparent",
          "&:hover": { transform: "translateY(-1px)", boxShadow: `0 14px 30px -8px ${accent.glow}` },
          "&:active": { transform: "translateY(0) scale(0.98)" },
        }}
      >
        {pkg.ctaLabel}
        <OpenInNewRoundedIcon sx={{ fontSize: 15 }} />
      </ButtonBase>
    </Card>
  );
}
