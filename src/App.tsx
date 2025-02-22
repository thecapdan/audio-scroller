import React, { useRef, useState } from "react";
import {
  Box,
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

import episode_1 from "./assets/episodes/episode_1.mp3";
import episode_meta_1 from "./assets/episodes/episode_1_meta.json";
import episode_meta_2 from "./assets/episodes/episode_2_meta.json";

import AudioTrack from "./components/AudioTrack";
import { AndroidStyleSwitch } from "./components/atoms/AndroidStyleSwitch";
import EpisodeList from "./components/EpisodeList";

const episodeMeta: { [key: number]: any } = {
  1: episode_meta_1,
  2: episode_meta_2,
};

const LandingPage: React.FC = () => {
  const [episodeNumber, setEpisodeNumber] = React.useState(1);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [transcriptSettings, setTranscriptSettings] = React.useState({
    autoScroll: false,
    showHighlight: true,
  });
  const settingsAnchorRef = useRef(null);
  const transcriptRef = useRef<TranscriptRef>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const updateEpisode = (index: number) => {
    setEpisodeNumber(index);
  };

  const settingsUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    setTranscriptSettings({
      ...transcriptSettings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleTrackJump = (timestamp: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestamp;
    }
  };

  const paragraphHop = (index: number) => {
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
        onClose={toggleDrawer} // 👈 Ensure it closes on backdrop click
        variant="persistent"
        sx={{ width: "15%", flexShrink: 0 }}
      >
        <Box
          sx={{
            width: "90%",
            borderRight: "1px solid #ccc",
            p: 2,
            overflowY: "auto",
            paddingLeft: "25px",
          }}
        >
          <EpisodeList
            episodes={episodeMeta}
            selectEpisode={(episodeIndex: number) => {
              updateEpisode(episodeIndex);
              toggleDrawer();
            }}
          />
        </Box>
      </Drawer>
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar
          position="sticky"
          color="default"
          elevation={1}
          sx={{
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ccc",
            paddingLeft: "35px",
          }}
        >
          <Toolbar>
            <AudioTrack
              pathToMp3={episode_1}
              timestamps={episodeMeta[episodeNumber].timestamps}
              positionJump={paragraphHop}
              audioRef={audioRef}
            />
          </Toolbar>
        </AppBar>

        <Button
          variant="contained"
          onClick={() => toggleDrawer()}
          className="sideButton"
          sx={{ position: "fixed", padding: "0px", minWidth: "22px" }}
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
            title={episodeMeta[episodeNumber].title}
            text={episodeMeta[episodeNumber].text}
            translation={episodeMeta[episodeNumber].translations}
            jumpTo={handleTrackJump}
            timestamps={episodeMeta[episodeNumber].timestamps}
            ref={transcriptRef}
            settings={transcriptSettings}
            imageName={`episode_${episodeNumber}`}
          />
        </Box>
      </Box>
    </div>
  );
};

export default LandingPage;
