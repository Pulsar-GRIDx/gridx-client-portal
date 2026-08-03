import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// MTC-inspired signature blue — a deeper, richer telecom blue used for the
// primary accent, gradients, and glows across the app (distinct from the
// generic Tailwind blue-500/600 the rest of the `blue` scale below still
// uses for charts/badges, kept as-is so existing per-page hex references
// stay visually consistent rather than clashing with a new hue).
export const mtc = {
  blue: {
    100: "#dbe8ff",
    200: "#aecbff",
    300: "#7aa9ff",
    400: "#4b86ff",
    500: "#1f63f2",
    600: "#0d4fdb",
    700: "#0a3fb0",
    800: "#0a3489",
    900: "#0c2a63",
  },
  gradient: "linear-gradient(135deg, #1f63f2 0%, #0a3fb0 100%)",
  gradientHover: "linear-gradient(135deg, #3b78ff 0%, #0d4fdb 100%)",
  glow: "rgba(31, 99, 242, 0.35)",
  glowSoft: "rgba(31, 99, 242, 0.14)",
};

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: { 100: "#e2e8f0", 200: "#cbd5e1", 300: "#1e293b", 400: "#0f172a" },
        primaryT: { 300: "rgba(30, 41, 59, 0.85)", 400: "rgba(15, 23, 42, 0.85)" },
        blue: { 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a5f" },
        blueT: { 500: "rgba(59, 130, 246, 0.2)" },
        accent: { 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669" },
        surface: { 100: "#1e293b", 200: "#334155", 300: "#475569", 400: "#64748b" },
        black: { 100: "#f1f5f9", 200: "#e2e8f0", 300: "#94a3b8", 400: "#64748b", 500: "#475569", 600: "#334155", 700: "#1e293b", 800: "#0f172a", 900: "#020617" },
        yellow: { 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308" },
        red: { 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626" },
        redT: { 500: "rgba(239, 68, 68, 0.2)" },
        green: { 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a" },
        greenT: { 600: "rgba(22, 163, 74, 0.2)" },
        orange: { 400: "#fb923c", 500: "#f97316" },
        card: "rgba(30, 41, 59, 0.55)",
        cardBorder: "rgba(148, 163, 184, 0.12)",
        textPrimary: "#f1f5f9",
        textSecondary: "#94a3b8",
        cardShadow: "0 1px 2px rgba(0,0,0,0.4), 0 12px 32px -12px rgba(0,0,0,0.55)",
        cardShadowHover: "0 1px 2px rgba(0,0,0,0.4), 0 20px 40px -14px rgba(0,0,0,0.65)",
      }
    : {
        primary: { 100: "#0f172a", 200: "#1e293b", 300: "#f1f5f9", 400: "#f8fafc" },
        primaryT: { 300: "rgba(241, 245, 249, 0.85)", 400: "rgba(248, 250, 252, 0.85)" },
        blue: { 100: "#1e3a5f", 200: "#1e40af", 300: "#1d4ed8", 400: "#2563eb", 500: "#3b82f6", 600: "#60a5fa", 700: "#93c5fd", 800: "#bfdbfe", 900: "#dbeafe" },
        blueT: { 500: "rgba(59, 130, 246, 0.15)" },
        accent: { 100: "#059669", 200: "#10b981", 300: "#34d399", 400: "#6ee7b7", 500: "#a7f3d0", 600: "#d1fae5" },
        surface: { 100: "#ffffff", 200: "#f8fafc", 300: "#f1f5f9", 400: "#e2e8f0" },
        black: { 100: "#020617", 200: "#0f172a", 300: "#1e293b", 400: "#334155", 500: "#475569", 600: "#64748b", 700: "#94a3b8", 800: "#cbd5e1", 900: "#f1f5f9" },
        yellow: { 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308" },
        red: { 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626" },
        redT: { 500: "rgba(239, 68, 68, 0.15)" },
        green: { 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a" },
        greenT: { 600: "rgba(22, 163, 74, 0.15)" },
        orange: { 400: "#fb923c", 500: "#f97316" },
        card: "#ffffff",
        cardBorder: "#e2e8f0",
        textPrimary: "#0f172a",
        textSecondary: "#64748b",
        cardShadow: "0 1px 2px rgba(15,23,42,0.04), 0 12px 28px -14px rgba(15,23,42,0.12)",
        cardShadowHover: "0 1px 2px rgba(15,23,42,0.06), 0 20px 36px -16px rgba(15,23,42,0.16)",
      }),
});

export const themeSettings = (mode) => {
  const t = tokens(mode);
  const isDark = mode === "dark";
  return {
    palette: {
      mode,
      ...(isDark
        ? {
            primary: { main: mtc.blue[500], light: mtc.blue[400], dark: mtc.blue[700] },
            secondary: { main: "#10b981" },
            background: { default: "#0a0f1e", paper: "#111a2e" },
            text: { primary: "#f1f5f9", secondary: "#94a3b8" },
            divider: "rgba(148, 163, 184, 0.12)",
          }
        : {
            primary: { main: mtc.blue[600], light: mtc.blue[500], dark: mtc.blue[800] },
            secondary: { main: "#059669" },
            background: { default: "#f4f6fb", paper: "#ffffff" },
            text: { primary: "#0f172a", secondary: "#64748b" },
            divider: "#e2e8f0",
          }),
    },
    typography: {
      fontFamily: ["Inter", "system-ui", "sans-serif"].join(","),
      fontSize: 13,
      h1: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" },
      h2: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 27, fontWeight: 700, letterSpacing: "-0.01em" },
      h3: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" },
      h4: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 17, fontWeight: 600 },
      h5: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 15, fontWeight: 600 },
      h6: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, fontWeight: 600 },
      body1: { fontSize: 14 },
      body2: { fontSize: 13 },
      overline: { fontWeight: 700, letterSpacing: "0.08em" },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": { scrollbarWidth: "thin", scrollbarColor: `${isDark ? "#334155" : "#cbd5e1"} transparent` },
          "*::-webkit-scrollbar": { width: 8, height: 8 },
          "*::-webkit-scrollbar-thumb": { backgroundColor: isDark ? "#334155" : "#cbd5e1", borderRadius: 8 },
          "*::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600, borderRadius: 10, padding: "8px 20px" },
          containedPrimary: {
            backgroundImage: mtc.gradient,
            boxShadow: `0 8px 20px -6px ${mtc.glow}`,
            "&:hover": { backgroundImage: mtc.gradientHover, boxShadow: `0 10px 26px -6px ${mtc.glow}` },
          },
          outlined: { borderWidth: 1.5, "&:hover": { borderWidth: 1.5 } },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            borderRadius: 16,
            backgroundColor: isDark ? "#111a2e" : "#ffffff",
            border: `1px solid ${t.cardBorder}`,
            boxShadow: t.cardShadow,
            transition: "box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 8 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: isDark ? "rgba(148,163,184,0.08)" : "#eef1f6", fontSize: 13 },
          head: { fontWeight: 700, fontSize: 11.5, letterSpacing: "0.04em", textTransform: "uppercase", color: t.textSecondary },
        },
      },
      MuiButtonBase: {
        defaultProps: { disableRipple: false },
        styleOverrides: {
          // Removes the grey/blue flash Android Chrome & iOS Safari draw on
          // tap by default — every custom ButtonBase-based control (filter
          // chips, term toggles, card CTAs) otherwise gets a jarring flash
          // that clashes with our own hover/active treatments.
          root: { WebkitTapHighlightColor: "transparent" },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: isDark ? "#1e293b" : "#0f172a", fontSize: 11.5, borderRadius: 8, padding: "6px 10px" },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: { borderRadius: 8, height: 6 },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: { backgroundColor: isDark ? "rgba(148,163,184,0.08)" : "rgba(15,23,42,0.06)" },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { backgroundImage: "none" },
        },
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [],
  );
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
