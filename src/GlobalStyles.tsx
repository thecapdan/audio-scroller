import { GlobalStyles as MuiGlobalStyles } from "@mui/material";

export const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={(theme) => ({
      body: {
        margin: 0,
        display: "flex",
        placeItems: "center",
        minWidth: "320px",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      },
      ".sideButton": {
        position: "fixed",
        minWidth: "30px",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        height: "100%",
        writingMode: "vertical-rl",
        textAlign: "center",
        borderRadius: "0 8px 8px 0",
        zIndex: 1300,
        padding: "0px",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
    })}
  />
);
