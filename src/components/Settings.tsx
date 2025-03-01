import React from "react";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

interface SettingsProps {
  isOpen: boolean;
  anchor: any;
  setSettingsOpen: Function;
  settingsUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoScroll: boolean;
  showHighlight: boolean;
  showTimestamps: boolean;
  isDarkMode: boolean;
}

const AndroidStyleSwitch = styled((props: any) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }: any) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      opacity: 0.7,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const Settings: React.FC<SettingsProps> = ({
  isOpen,
  anchor,
  settingsUpdate,
  autoScroll,
  showHighlight,
  showTimestamps,
  setSettingsOpen,
  isDarkMode,
}) => {
  return (
    <Popper
      open={isOpen}
      anchorEl={anchor}
      placement="left-start"
      disablePortal
    >
      <ClickAwayListener onClickAway={() => setSettingsOpen(false)}>
        <Paper elevation={3} sx={{ paddingLeft: "20px" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <AndroidStyleSwitch
                  checked={autoScroll}
                  onChange={settingsUpdate}
                  name="autoScroll"
                />
              }
              label="Auto Scroll"
              sx={{ padding: "5px" }}
            />
            <FormControlLabel
              control={
                <AndroidStyleSwitch
                  onChange={settingsUpdate}
                  checked={showHighlight}
                  name="showHighlight"
                />
              }
              label="Highlight"
              sx={{ padding: "5px" }}
            />
            <FormControlLabel
              control={
                <AndroidStyleSwitch
                  onChange={settingsUpdate}
                  checked={showTimestamps}
                  name="showTimestamps"
                />
              }
              label="Timestamps"
              sx={{ padding: "5px" }}
            />
            <FormControlLabel
              control={
                <AndroidStyleSwitch
                  onChange={settingsUpdate}
                  checked={isDarkMode}
                  name="darkMode"
                />
              }
              label="Dark Mode"
              sx={{ padding: "5px" }}
            />
          </FormGroup>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default Settings;
