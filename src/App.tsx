import React, { useRef, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Popper,
  ClickAwayListener,
  Paper,
  FormGroup,
  FormControlLabel,
  Button,
  Drawer,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Transcript, { TranscriptRef } from "./components/Transcript";

import mp3File from "./assets/episode_1/recording.m4a";

import episode from "./assets/episode_1/AC Page 1.json";
import AudioTrack, { AudioTrackRef } from "./components/AudioTrack";
import { AndroidStyleSwitch } from "./components/atoms/AndroidStyleSwitch";

const sideButtonStyle = {
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
};

const LandingPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [filter, setFilter] = useState("");
  const [items] = useState([
    "Episode 1: Agatha Christie",
    "Episode 2: The Gunpowder Plot",
    "Episode 3: The Canoe Man",
    "Episode 4: DB Cooper",
  ]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [transcriptSettings, setTranscriptSettings] = React.useState({
    autoScroll: true,
    showHighlight: true,
  });
  const settingsAnchorRef = useRef(null);
  const audioTrackRef = useRef<AudioTrackRef>(null);
  const transcriptRef = useRef<TranscriptRef>(null);

  const settingsUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    setTranscriptSettings({
      ...transcriptSettings,
      [event.target.name]: event.target.checked,
    });
  };

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase())
  );

  const handleTrackJump = (timestamp: number) => {
    if (audioTrackRef.current) {
      audioTrackRef.current.handleJumpToTimestamp(timestamp);
    }
  };

  const paragraphHop = (index: number) => {
    console.log("JUMP");
    transcriptRef.current?.jumpToParagraph(index);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      {" "}
      <Drawer
        open={drawerOpen}
        onClose={() => toggleDrawer()}
        variant="persistent" // Keeps drawer open unless closed manually
        sx={{ width: "15%", flexShrink: 0 }} // Ensure drawer is 25% of the screen
      >
        <Box
          sx={{
            width: "90%", // Make sure the content inside drawer fills it
            borderRight: "1px solid #ccc",
            p: 2,
            overflowY: "auto",
            paddingLeft: "25px",
          }}
        >
          <TextField
            label="Filter List"
            variant="outlined"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ mb: 2, paddingLeft: "10px" }}
          />
          <List>
            {filteredItems.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          paddingLeft: "35px",
        }}
      >
        <AppBar
          position="sticky"
          color="default"
          elevation={1}
          sx={{
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Toolbar>
            <AudioTrack
              pathToMp3={mp3File}
              timestamps={episode.timestamps}
              positionJump={paragraphHop}
              ref={audioTrackRef}
            />
          </Toolbar>
        </AppBar>

        <Button
          variant="contained"
          onClick={() => toggleDrawer()}
          sx={sideButtonStyle}
        >
          Episodes
        </Button>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 3,
            backgroundColor: "#fafafa",
          }}
          onClick={() => setDrawerOpen(false)}
        >
          <IconButton
            ref={settingsAnchorRef}
            onClick={() => setSettingsOpen((prev) => !prev)}
            sx={{
              position: "fixed",
              top: "150px",
              right: "20px",
              zIndex: 2000,
              backgroundColor: "white",
              borderRadius: "50%",
              boxShadow: 3,
              padding: "10px",
            }}
          >
            <SettingsIcon />
          </IconButton>

          <Popper
            open={settingsOpen}
            anchorEl={settingsAnchorRef.current}
            placement="left-start"
            disablePortal
          >
            <ClickAwayListener onClickAway={() => setSettingsOpen(false)}>
              <Paper elevation={3}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <AndroidStyleSwitch
                        checked={transcriptSettings.autoScroll}
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
                        checked={transcriptSettings.showHighlight}
                        name="showHighlight"
                      />
                    }
                    label="Highlight"
                    sx={{ paddingLeft: "10px" }}
                  />
                </FormGroup>
              </Paper>
            </ClickAwayListener>
          </Popper>

          <Transcript
            title={episode.title}
            text={episode.text}
            translation={episode.translations}
            jumpTo={handleTrackJump}
            timestamps={episode.timestamps}
            ref={transcriptRef}
            settings={transcriptSettings}
          />
        </Box>
      </Box>
    </div>
  );
};

export default LandingPage;
