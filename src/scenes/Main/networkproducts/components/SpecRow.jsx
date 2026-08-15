import { Box, Typography } from "@mui/material";

/** One icon + label + value row used inside package cards and the comparison table. */
export default function SpecRow({ icon, label, value, accentColor, dense }) {
  return (
    <Box sx={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      py: dense ? 0.6 : 0.85,
    }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
        <Box sx={{
          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          bgcolor: `${accentColor}1f`, color: accentColor,
          "& .MuiSvgIcon-root": { fontSize: 13 },
        }}>
          {icon}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
          {label}
        </Typography>
      </Box>
      {/* minWidth:0 + wrapping rather than flexShrink:0 — several Africa Online
          spec values are long ("25 Mbps — N$550/mo"), and pinning the value
          open pushed the row past the card edge on narrow phones. */}
      <Typography sx={{
        fontSize: 12.5, fontWeight: 700, textAlign: "right", minWidth: 0, ml: 1,
        overflowWrap: "anywhere",
      }}>
        {value}
      </Typography>
    </Box>
  );
}
