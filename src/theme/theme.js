import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
/**
 * @module Theme
 */

/**
 * Generates color tokens based on the mode (dark or light).
 *
 * @param {string} mode - Color mode ('dark' or 'light')
 * @returns {Object} Color tokens object containing color values for different themes
 */

// color design tokens export
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#b0b0d0",
          200: "#d8d8f8",
          300: "#1F2A40",
          400: "#141B2D",
        },
        blue: {
          100: "#d1d4e3",
          200: "#a2a9c8",
          300: "#747fac",
          400: "#455491",
          500: "#172975",
          600: "#12215e",
          700: "#0e1946",
          800: "#09102f",
          900: "#050817",
        },
        black: {
          100: "#cfcfcf",
          200: "#9e9e9e",
          300: "#6e6e6e",
          400: "#3d3d3d",
          500: "#0d0d0d",
          600: "#0a0a0a",
          700: "#080808",
          800: "#050505",
          900: "#030303",
        },
        yellow: {
          100: "#fcf1cd",
          200: "#fae29b",
          300: "#f7d469",
          400: "#f5c537",
          500: "#f2b705",
          600: "#c29204",
          700: "#916e03",
          800: "#614902",
          900: "#302501",
        },
        red: {
          100: "#fcdacd",
          200: "#fab49b",
          300: "#f78f69",
          400: "#f56937",
          500: "#f24405",
          600: "#c23604",
          700: "#912903",
          800: "#611b02",
          900: "#300e01",
        },
        green: {
          100: "#dae8cd",
          200: "#b6d19a",
          300: "#91ba68",
          400: "#6da335",
          500: "#488c03",
          600: "#3a7002",
          700: "#2b5402",
          800: "#1d3801",
          900: "#0e1c01",
        },
        //Transparent BG
        primaryT: {
          100: "rgba(176, 176, 208, 0.5)",
          200: "rgba(216, 216, 248, 0.5)",
          300: "rgba(31, 42, 64, 0.5)",
          400: "rgba(20, 27, 45, 0.5)",
        },
        blueT: {
          100: "rgba(209, 212, 227, 0.5)",
          200: "rgba(162, 169, 200, 0.5)",
          300: "rgba(116, 127, 172, 0.5)",
          400: "rgba(69, 84, 145, 0.5)",
          500: "rgba(23, 41, 117, 0.5)",
          600: "rgba(18, 33, 94, 0.5)",
          700: "rgba(14, 25, 70, 0.5)",
          800: "rgba(9, 16, 47, 0.5)",
          900: "rgba(5, 8, 23, 0.5)",
        },
        blackT: {
          100: "rgba(207, 207, 207, 0.5)",
          200: "rgba(158, 158, 158, 0.5)",
          300: "rgba(110, 110, 110, 0.5)",
          400: "rgba(61, 61, 61, 0.5)",
          500: "rgba(13, 13, 13, 0.5)",
          600: "rgba(10, 10, 10, 0.5)",
          700: "rgba(8, 8, 8, 0.5)",
          800: "rgba(5, 5, 5, 0.5)",
          900: "rgba(3, 3, 3, 0.5)",
        },
        yellowT: {
          100: "rgba(252, 241, 205, 0.5)",
          200: "rgba(250, 226, 155, 0.5)",
          300: "rgba(247, 212, 105, 0.5)",
          400: "rgba(245, 197, 55, 0.5)",
          500: "rgba(242, 183, 5, 0.5)",
          600: "rgba(194, 146, 4, 0.5)",
          700: "rgba(145, 110, 3, 0.5)",
          800: "rgba(97, 73, 2, 0.5)",
          900: "rgba(48, 37, 1, 0.5)",
        },
        redT: {
          100: "rgba(252, 218, 205, 0.5)",
          200: "rgba(250, 180, 155, 0.5)",
          300: "rgba(247, 143, 105, 0.5)",
          400: "rgba(245, 105, 55, 0.5)",
          500: "rgba(242, 68, 5, 0.5)",
          600: "rgba(194, 54, 4, 0.5)",
          700: "rgba(145, 41, 3, 0.5)",
          800: "rgba(97, 27, 2, 0.5)",
          900: "rgba(48, 14, 1, 0.5)",
        },
        greenT: {
          100: "rgba(218, 232, 205, 0.5)",
          200: "rgba(182, 209, 154, 0.5)",
          300: "rgba(145, 186, 104, 0.5)",
          400: "rgba(109, 163, 53, 0.5)",
          500: "rgba(72, 140, 3, 0.5)",
          600: "rgba(58, 112, 2, 0.5)",
          700: "rgba(43, 84, 2, 0.5)",
          800: "rgba(29, 56, 1, 0.5)",
          900: "rgba(14, 28, 1, 0.5)",
        },
      }
    : {
        primary: {
          100: "#141B2D",
          200: "#1F2A40",
          300: "#d8d8f8",
          400: "#b0b0d0",
        },
        blue: {
          100: "#050817",
          200: "#09102f",
          300: "#0e1946",
          400: "#12215e",
          500: "#172975",
          600: "#455491",
          700: "#747fac",
          800: "#a2a9c8",
          900: "#d1d4e3",
        },
        black: {
          100: "#030303",
          200: "#050505",
          300: "#080808",
          400: "#0a0a0a",
          500: "#0d0d0d",
          600: "#3d3d3d",
          700: "#6e6e6e",
          800: "#9e9e9e",
          900: "#cfcfcf",
        },
        yellow: {
          100: "#302501",
          200: "#614902",
          300: "#916e03",
          400: "#c29204",
          500: "#f2b705",
          600: "#f5c537",
          700: "#f7d469",
          800: "#fae29b",
          900: "#fcf1cd",
        },
        red: {
          100: "#300e01",
          200: "#611b02",
          300: "#912903",
          400: "#c23604",
          500: "#f24405",
          600: "#f56937",
          700: "#f78f69",
          800: "#fab49b",
          900: "#fcdacd",
        },
        green: {
          100: "#0e1c01",
          200: "#1d3801",
          300: "#2b5402",
          400: "#3a7002",
          500: "#488c03",
          600: "#6da335",
          700: "#91ba68",
          800: "#b6d19a",
          900: "#dae8cd",
        },
        primaryT: {
          100: "rgba(20, 27, 45, 0.5)",
          200: "rgba(31, 42, 64, 0.5)",
          300: "rgba(216, 216, 248, 0.5)",
          400: "rgba(176, 176, 208, 0.5)",
        },
        blueT: {
          100: "rgba(5, 8, 23, 0.5)",
          200: "rgba(9, 16, 47, 0.5)",
          300: "rgba(14, 25, 70, 0.5)",
          400: "rgba(18, 33, 94, 0.5)",
          500: "rgba(23, 41, 117, 0.5)",
          600: "rgba(69, 84, 145, 0.5)",
          700: "rgba(116, 127, 172, 0.5)",
          800: "rgba(162, 169, 200, 0.5)",
          900: "rgba(209, 212, 227, 0.5)",
        },
        blackT: {
          100: "rgba(3, 3, 3, 0.5)",
          200: "rgba(5, 5, 5, 0.5)",
          300: "rgba(8, 8, 8, 0.5)",
          400: "rgba(10, 10, 10, 0.5)",
          500: "rgba(13, 13, 13, 0.5)",
          600: "rgba(61, 61, 61, 0.5)",
          700: "rgba(110, 110, 110, 0.5)",
          800: "rgba(158, 158, 158, 0.5)",
          900: "rgba(207, 207, 207, 0.5)",
        },
        yellowT: {
          100: "rgba(48, 37, 1, 0.5)",
          200: "rgba(97, 73, 2, 0.5)",
          300: "rgba(145, 110, 3, 0.5)",
          400: "rgba(194, 146, 4, 0.5)",
          500: "rgba(242, 183, 5, 0.5)",
          600: "rgba(245, 197, 55, 0.5)",
          700: "rgba(247, 212, 105, 0.5)",
          800: "rgba(250, 226, 155, 0.5)",
          900: "rgba(252, 241, 205, 0.5)",
        },
        redT: {
          100: "rgba(48, 14, 1, 0.5)",
          200: "rgba(97, 27, 2, 0.5)",
          300: "rgba(145, 41, 3, 0.5)",
          400: "rgba(194, 54, 4, 0.5)",
          500: "rgba(242, 68, 5, 0.5)",
          600: "rgba(245, 105, 55, 0.5)",
          700: "rgba(247, 143, 105, 0.5)",
          800: "rgba(250, 180, 155, 0.5)",
          900: "rgba(252, 218, 205, 0.5)",
        },
        greenT: {
          100: "rgba(14, 28, 1, 0.5)",
          200: "rgba(29, 56, 1, 0.5)",
          300: "rgba(43, 84, 2, 0.5)",
          400: "rgba(58, 112, 2, 0.5)",
          500: "rgba(72, 140, 3, 0.5)",
          600: "rgba(109, 163, 53, 0.5)",
          700: "rgba(145, 186, 104, 0.5)",
          800: "rgba(182, 209, 154, 0.5)",
          900: "rgba(218, 232, 205, 0.5)",
        },
      }),
});

/**
 * Generates MUI theme settings based on the color mode.
 *
 * @param {string} mode - Color mode ('dark' or 'light')
 * @returns {Object} MUI theme object with palette and typography settings
 */
// mui theme settings
export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              main: colors.primary[400],
            },
            secondary: {
              main: colors.black[500],
            },
            neutral: {
              dark: colors.black[700],
              main: colors.black[500],
              light: colors.black[100],
            },
            background: {
              // default: colors.primary[800],
              default: colors.primary[400],
            },
          }
        : {
            // palette values for light mode
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.black[500],
            },
            neutral: {
              dark: colors.black[700],
              main: colors.black[500],
              light: colors.black[100],
            },
            background: {
              default: colors.primary[400],
            },
          }),
    },

    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

/**
 * Context for managing color mode (dark or light).
 */

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [],
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
