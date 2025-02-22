import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  Stack,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Transcript, { TranscriptRef } from "./components/Transcript";

import episode_1 from "./assets/episodes/episode_1.mp3";
import episode_meta_1 from "./assets/episodes/episode_1_meta.json";
import episode_meta_2 from "./assets/episodes/episode_2_meta.json";

import AudioTrack from "./components/AudioTrack";
import EpisodeList from "./components/EpisodeList";
import Settings from "./components/Settings";
import SavedNotes from "./components/SavedNotes";

const episodeMeta: { [key: number]: any } = {
  1: episode_meta_1,
  2: episode_meta_2,
};

const LandingPage: React.FC = () => {
  const [episodeNumber, setEpisodeNumber] = React.useState(1);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showTimestamps, setShowtimestamps] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [transcriptSettings, setTranscriptSettings] = React.useState({
    autoScroll: false,
    showHighlight: true,
  });
  const settingsAnchorRef = useRef(null);
  const notesAnchorRef = useRef(null);
  const transcriptRef = useRef<TranscriptRef>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // useEffect(() => {
  //   updateNotes();
  // });

  const updateEpisode = (index: number) => {
    setEpisodeNumber(index);
  };

  const settingsUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTranscriptSettings({
      ...transcriptSettings,
      [event.target.name]: event.target.checked,
    });
    if (event.target.name === "showTimestamps") {
      setShowtimestamps(event.target.checked);
    }
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

  const updateNotes = () => {
    const savedTranslations = JSON.parse(
      localStorage.getItem("savedTranslations") || "{}"
    );
    setSavedNotes(savedTranslations);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      {" "}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
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
              showTimestamps={showTimestamps}
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
          <Stack
            spacing={1}
            sx={{
              position: "fixed",
              top: "150px",
              right: "20px",
              zIndex: 2000,
            }}
          >
            <IconButton
              ref={settingsAnchorRef}
              onClick={() => setSettingsOpen((prev) => !prev)}
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: 3,
                padding: "10px",
                "&:hover": {
                  backgroundColor: "grey",
                },
              }}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              ref={notesAnchorRef}
              onClick={() => setNotesOpen((prev) => !prev)}
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                boxShadow: 3,
                padding: "10px",
                "&:hover": {
                  backgroundColor: "grey",
                },
              }}
            >
              <EditNoteIcon />
            </IconButton>
          </Stack>

          <Settings
            isOpen={settingsOpen}
            anchor={settingsAnchorRef.current}
            setSettingsOpen={setSettingsOpen}
            autoScroll={transcriptSettings.autoScroll}
            showHighlight={transcriptSettings.showHighlight}
            showTimestamps={showTimestamps}
            settingsUpdate={settingsUpdate}
          />

          <SavedNotes
            isOpen={notesOpen}
            setNotesOpen={setNotesOpen}
            notes={savedNotes}
          />

          <Transcript
            title={episodeMeta[episodeNumber].title}
            text={episodeMeta[episodeNumber].text}
            translation={episodeMeta[episodeNumber].translations}
            jumpTo={handleTrackJump}
            timestamps={episodeMeta[episodeNumber].timestamps}
            ref={transcriptRef}
            settings={transcriptSettings}
            imageName={`episode_${episodeNumber}`}
            onNotesUpdate={updateNotes}
          />
        </Box>
      </Box>
    </div>
  );
};

export default LandingPage;
