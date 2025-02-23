import { createTheme, ThemeOptions } from "@mui/material/styles";

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    h1: {
      fontSize: "3.2em",
      lineHeight: 1.1,
    },
    // Add other typography styles as needed
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "0.6em 1.2em",
          fontSize: "1em",
          fontWeight: 500,
          transition: "border-color 0.25s",
          "&:hover": {
            borderColor: "#646cff",
          },
          "&:focus, &:focus-visible": {
            outline: "4px auto -webkit-focus-ring-color",
          },
        },
        sizeSmall: {
          padding: "4px 8px",
          fontSize: "0.8125rem",
        },
      },
    },
    // Add other component style overrides as needed
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#f9f9f9",
    },
    text: {
      primary: "#213547",
    },
    primary: {
      main: "#620ebb",
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    background: {
      default: "#242424",
      paper: "#1a1a1a",
    },
    text: {
      primary: "rgba(255, 255, 255, 0.87)",
    },
    primary: {
      main: "#646cff",
    },
  },
});
