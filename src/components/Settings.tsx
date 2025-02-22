import {
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
  Paper,
  Popper,
} from "@mui/material";
import { AndroidStyleSwitch } from "./atoms/AndroidStyleSwitch";

interface SettingsProps {
  isOpen: boolean;
  anchor: any;
  setSettingsOpen: Function;
  settingsUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
  autoScroll: boolean;
  showHighlight: boolean;
  showTimestamps: boolean;
}

const Settings: React.FC<SettingsProps> = ({
  isOpen,
  anchor,
  settingsUpdate,
  autoScroll,
  showHighlight,
  showTimestamps,
  setSettingsOpen,
}) => {
  return (
    <Popper
      open={isOpen}
      anchorEl={anchor}
      placement="left-start"
      disablePortal
    >
      <ClickAwayListener onClickAway={() => setSettingsOpen(false)}>
        <Paper elevation={3}>
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
              sx={{ paddingLeft: "10px" }}
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
              sx={{ paddingLeft: "10px" }}
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
              sx={{ paddingLeft: "10px" }}
            />
          </FormGroup>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default Settings;
