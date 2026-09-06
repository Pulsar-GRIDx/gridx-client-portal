import { Box, ButtonBase, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { mtc } from "../../../../theme/theme";

/**
 * Visual pill filter row (emoji + label) replacing plain text tabs.
 * On phones it becomes a horizontally-scrollable, snap-to-chip row (the
 * same pattern App Store / Play Store category rails use) rather than
 * wrapping to several lines and pushing the cards further down the page;
 * from `sm` up there's enough width for a normal wrapping row.
 */
export default function CategoryFilters({ categories, active, onChange }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const items = [
    { id: "all", label: "All Products", shortLabel: "All", emoji: "✨", accent: { gradient: mtc.gradient, solid: mtc.blue[500], glow: mtc.glow } },
    ...categories,
  ];

  return (
    <Box sx={{
      display: "flex",
      gap: 1.1,
      mb: { xs: 3, sm: 4 },
      mx: { xs: -2, sm: 0 },
      px: { xs: 2, sm: 0 },
      flexWrap: { xs: "nowrap", sm: "wrap" },
      overflowX: { xs: "auto", sm: "visible" },
      scrollSnapType: { xs: "x proximity", sm: "none" },
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": { display: "none" },
    }}>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <ButtonBase
            key={item.id}
            onClick={() => onChange(item.id)}
            sx={{
              display: "flex", alignItems: "center", gap: 1, flexShrink: 0,
              minHeight: 44, px: 2, py: 1, borderRadius: "2px",
              scrollSnapAlign: "start",
              border: `1.5px solid ${isActive ? item.accent.solid : (isDark ? "rgba(148,163,184,0.18)" : "#e2e8f0")}`,
              background: isActive ? (isDark ? "rgba(31,99,242,0.14)" : "rgba(13,79,219,0.06)") : (isDark ? "rgba(255,255,255,0.02)" : "#fff"),
              boxShadow: "none",
              transition: "border-color 0.15s ease, background-color 0.15s ease",
              "&:hover": { borderColor: item.accent.solid },
            }}
          >
            <Typography sx={{ fontSize: 16, lineHeight: 1 }}>{item.emoji}</Typography>
            <Typography sx={{
              fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
              color: isActive ? item.accent.solid : "text.primary",
            }}>
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>{item.label}</Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>{item.shortLabel}</Box>
            </Typography>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
