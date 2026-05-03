import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: { 100: "#e2e8f0", 200: "#cbd5e1", 300: "#1e293b", 400: "#0f172a" },
        blue: { 100: "#dbeafe", 200: "#bfdbfe", 300: "#93c5fd", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 800: "#1e40af", 900: "#1e3a5f" },
        accent: { 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7", 400: "#34d399", 500: "#10b981", 600: "#059669" },
        surface: { 100: "#1e293b", 200: "#334155", 300: "#475569", 400: "#64748b" },
        black: { 100: "#f1f5f9", 200: "#e2e8f0", 300: "#94a3b8", 400: "#64748b", 500: "#475569", 600: "#334155", 700: "#1e293b", 800: "#0f172a", 900: "#020617" },
        yellow: { 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308" },
        red: { 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626" },
        green: { 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a" },
        orange: { 400: "#fb923c", 500: "#f97316" },
        card: "rgba(30, 41, 59, 0.8)",
        cardBorder: "rgba(51, 65, 85, 0.5)",
        textPrimary: "#f1f5f9",
        textSecondary: "#94a3b8",
      }
    : {
        primary: { 100: "#0f172a", 200: "#1e293b", 300: "#f1f5f9", 400: "#f8fafc" },
        blue: { 100: "#1e3a5f", 200: "#1e40af", 300: "#1d4ed8", 400: "#2563eb", 500: "#3b82f6", 600: "#60a5fa", 700: "#93c5fd", 800: "#bfdbfe", 900: "#dbeafe" },
        accent: { 100: "#059669", 200: "#10b981", 300: "#34d399", 400: "#6ee7b7", 500: "#a7f3d0", 600: "#d1fae5" },
        surface: { 100: "#ffffff", 200: "#f8fafc", 300: "#f1f5f9", 400: "#e2e8f0" },
        black: { 100: "#020617", 200: "#0f172a", 300: "#1e293b", 400: "#334155", 500: "#475569", 600: "#64748b", 700: "#94a3b8", 800: "#cbd5e1", 900: "#f1f5f9" },
        yellow: { 100: "#fef9c3", 200: "#fef08a", 300: "#fde047", 400: "#facc15", 500: "#eab308" },
        red: { 100: "#fee2e2", 200: "#fecaca", 300: "#fca5a5", 400: "#f87171", 500: "#ef4444", 600: "#dc2626" },
        green: { 100: "#dcfce7", 200: "#bbf7d0", 300: "#86efac", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a" },
        orange: { 400: "#fb923c", 500: "#f97316" },
        card: "#ffffff",
        cardBorder: "#e2e8f0",
        textPrimary: "#0f172a",
        textSecondary: "#64748b",
      }),
});

export const themeSettings = (mode) => {
  return {
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            primary: { main: "#3b82f6" },
            secondary: { main: "#10b981" },
            background: { default: "#0f172a", paper: "#1e293b" },
            text: { primary: "#f1f5f9", secondary: "#94a3b8" },
          }
        : {
            primary: { main: "#2563eb" },
            secondary: { main: "#059669" },
            background: { default: "#f1f5f9", paper: "#ffffff" },
            text: { primary: "#0f172a", secondary: "#64748b" },
          }),
    },
    typography: {
      fontFamily: ["Inter", "system-ui", "sans-serif"].join(","),
      fontSize: 13,
      h1: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 32, fontWeight: 700 },
      h2: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 26, fontWeight: 700 },
      h3: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 20, fontWeight: 600 },
      h4: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 17, fontWeight: 600 },
      h5: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 15, fontWeight: 500 },
      h6: { fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, fontWeight: 500 },
      body1: { fontSize: 14 },
      body2: { fontSize: 13 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600, borderRadius: 8, padding: "8px 20px" },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { backgroundImage: "none", borderRadius: 16 },
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
