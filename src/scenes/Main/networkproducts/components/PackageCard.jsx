import { useState } from "react";
import {
  Box, Card, Typography, Chip, Divider, Collapse, ButtonBase,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import AllInclusiveRoundedIcon from "@mui/icons-material/AllInclusiveRounded";
import BuildRoundedIcon from "@mui/icons-material/BuildRounded";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";
import DataUsageRoundedIcon from "@mui/icons-material/DataUsageRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import SmsRoundedIcon from "@mui/icons-material/SmsRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import SimCardRoundedIcon from "@mui/icons-material/SimCardRounded";
import { CATEGORY } from "../data/categories";
import SpecRow from "./SpecRow";
import StatusBadge from "./StatusBadge";

// Only Mobile lacks an official MTC asset (see branding.js) — Air Fibre and
// Fibre render category.iconAsset (the real MTC Spectra illustration) instead.
const CATEGORY_ICON_FALLBACK = {
  [CATEGORY.MOBILE]: <SimCardRoundedIcon sx={{ fontSize: { xs: 22, sm: 24, md: 26 } }} />,
};

const FEATURES_COLLAPSED_COUNT = 3;

export default function PackageCard({ pkg, category }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accent = category.accent;
  const [term, setTerm] = useState(36);
  const [expanded, setExpanded] = useState(false);

  const isBroadband = pkg.priceByTerm != null;
  const price = isBroadband ? pkg.priceByTerm[term] : pkg.priceMonthly;
  const extraFeatures = pkg.features.length - FEATURES_COLLAPSED_COUNT;

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

      {/* Icon + category chip */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{
          width: { xs: 44, sm: 48, md: 52 }, height: { xs: 44, sm: 48, md: 52 }, borderRadius: "16px",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: accent.gradient, color: "#fff", flexShrink: 0,
          boxShadow: `0 8px 20px -6px ${accent.glow}`,
        }}>
          {category.iconAsset ? (
            <Box
              component="img"
              src={category.iconAsset}
              alt=""
              sx={{
                width: "56%", height: "56%", objectFit: "contain",
                filter: category.iconAssetInvert ? "brightness(0) invert(1)" : "none",
              }}
            />
          ) : (
            CATEGORY_ICON_FALLBACK[pkg.category]
          )}
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

      {/* Speed / data badge */}
      <Box sx={{ mb: 2 }}>
        {isBroadband ? (
          <Chip
            label={`⬇ ${pkg.speedDown} Mbps`}
            sx={{
              fontWeight: 800, fontSize: 14, height: 32, px: 0.5,
              bgcolor: `${accent.solid}1a`, color: isDark ? accent.light : accent.dark,
            }}
          />
        ) : (
          <Chip
            icon={<DataUsageRoundedIcon sx={{ fontSize: 15, color: `${isDark ? accent.light : accent.dark} !important` }} />}
            label={`${pkg.data} / ${pkg.validity}`}
            sx={{
              fontWeight: 800, fontSize: 13, height: 32, px: 0.5,
              bgcolor: `${accent.solid}1a`, color: isDark ? accent.light : accent.dark,
            }}
          />
        )}
      </Box>

      {/* Price */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.6, mb: isBroadband ? 1 : 0.5, flexWrap: "wrap" }}>
        <Typography sx={{
          fontSize: { xs: 32, sm: 35, md: 38 }, fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1,
          backgroundImage: accent.gradient, backgroundClip: "text", WebkitBackgroundClip: "text",
          color: "transparent",
        }}>
          N${price.toFixed(price % 1 === 0 ? 0 : 2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isBroadband ? "/ month" : pkg.billingNote}
        </Typography>
      </Box>

      {isBroadband && (
        <Box sx={{ display: "flex", gap: 0.75, mb: 2.5 }}>
          {[12, 24, 36].map((t) => (
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

      <Divider sx={{ mb: 1 }} />

      {/* Spec rows */}
      <Box sx={{ mb: 1 }}>
        {isBroadband ? (
          <>
            <SpecRow icon={<ArrowDownwardRoundedIcon sx={{ fontSize: 13 }} />} label="Download" value={`${pkg.speedDown} Mbps`} accentColor={accent.solid} dense />
            <SpecRow icon={<ArrowUpwardRoundedIcon sx={{ fontSize: 13 }} />} label="Upload" value={pkg.speedUp ? `${pkg.speedUp} Mbps` : "Not publicly listed"} accentColor={accent.solid} dense />
            <SpecRow icon={<AllInclusiveRoundedIcon sx={{ fontSize: 13 }} />} label="Data" value={pkg.unlimited ? "Unlimited" : pkg.data} accentColor={accent.solid} dense />
            <SpecRow icon={<BuildRoundedIcon sx={{ fontSize: 13 }} />} label="Installation" value={pkg.installation} accentColor={accent.solid} dense />
            <SpecRow icon={<EventRepeatRoundedIcon sx={{ fontSize: 13 }} />} label="Contract" value={pkg.contract} accentColor={accent.solid} dense />
          </>
        ) : (
          <>
            <SpecRow icon={<DataUsageRoundedIcon sx={{ fontSize: 13 }} />} label="Data" value={pkg.data} accentColor={accent.solid} dense />
            <SpecRow icon={<CallRoundedIcon sx={{ fontSize: 13 }} />} label="Minutes" value={pkg.minutes} accentColor={accent.solid} dense />
            <SpecRow icon={<SmsRoundedIcon sx={{ fontSize: 13 }} />} label="SMS" value={pkg.sms} accentColor={accent.solid} dense />
            <SpecRow icon={<ScheduleRoundedIcon sx={{ fontSize: 13 }} />} label="Validity" value={pkg.validity} accentColor={accent.solid} dense />
          </>
        )}
      </Box>

      <Divider sx={{ mb: 1.5 }} />

      {/* Feature checklist */}
      <Box sx={{ mb: 2 }}>
        {pkg.features.slice(0, FEATURES_COLLAPSED_COUNT).map((f, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 0.6 }}>
            <CheckCircleRoundedIcon sx={{ fontSize: 15, color: accent.solid, mt: 0.1, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 12.5 }}>{f}</Typography>
          </Box>
        ))}
        {extraFeatures > 0 && (
          <>
            <Collapse in={expanded}>
              {pkg.features.slice(FEATURES_COLLAPSED_COUNT).map((f, i) => (
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

      {/* CTA */}
      <ButtonBase
        component="a"
        href="https://www.mtc.com.na"
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
        View on MTC.com.na
        <OpenInNewRoundedIcon sx={{ fontSize: 15 }} />
      </ButtonBase>
    </Card>
  );
}
