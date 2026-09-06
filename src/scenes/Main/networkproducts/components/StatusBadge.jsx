import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35); }
  50% { box-shadow: 0 0 0 5px rgba(255,255,255,0); }
`;

const BADGE_ICONS = {
  "Popular": <StarRoundedIcon sx={{ fontSize: 14 }} />,
  "Fastest Wireless": <BoltRoundedIcon sx={{ fontSize: 14 }} />,
  "Premium": <WorkspacePremiumRoundedIcon sx={{ fontSize: 14 }} />,
  "Best Value": <SavingsRoundedIcon sx={{ fontSize: 14 }} />,
  "New": <NewReleasesRoundedIcon sx={{ fontSize: 14 }} />,
  "Business": <BusinessCenterRoundedIcon sx={{ fontSize: 14 }} />,
};

const ANIMATED = new Set(["Popular", "New", "Fastest Wireless"]);

/** Floating ribbon badge (Popular / Premium / Best Value / etc.) anchored to a package card's top edge. */
export default function StatusBadge({ label, gradient }) {
  if (!label) return null;
  return (
    <Box sx={{
      position: "absolute", top: -14, left: 24, zIndex: 2,
      display: "flex", alignItems: "center", gap: 0.5,
      px: 1.5, py: 0.6, borderRadius: "2px",
      background: gradient,
      boxShadow: "0 6px 16px -4px rgba(0,0,0,0.35)",
      animation: ANIMATED.has(label) ? `${pulse} 2.4s ease-in-out infinite` : "none",
    }}>
      {BADGE_ICONS[label] || <StarRoundedIcon sx={{ fontSize: 14 }} />}
      <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
        {label}
      </Typography>
    </Box>
  );
}
