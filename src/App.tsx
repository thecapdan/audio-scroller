import React, { useEffect, useRef, useState } from "react";
import { ThemeProvider, CssBaseline, useTheme } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import { GlobalStyles } from "./GlobalStyles";

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
import StyleIcon from "@mui/icons-material/Style";
import Transcript, { TranscriptRef } from "./components/Transcript";

import episode_1 from "./assets/episodes/episode_1.mp3";
import episode_2 from "./assets/episodes/episode_2_audio.mp3";
import episode_meta_1 from "./assets/episodes/episode_1_meta.json";
import episode_meta_2 from "./assets/episodes/episode_2_meta.json";

import AudioTrack from "./components/AudioTrack";
import EpisodeList from "./components/EpisodeList";
import Settings from "./components/Settings";
import SavedNotes from "./components/SavedNotes";
import FlashCards from "./components/FlashCards";

const episodeMeta: { [key: number]: any } = {
  1: episode_meta_1,
  2: episode_meta_2,
};
const episodeTracks: { [key: number]: any } = {
  1: episode_1,
  2: episode_2,
};

const LandingPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = useTheme();

  const [episodeNumber, setEpisodeNumber] = React.useState(1);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [flashcardsOpen, setFlashcardsOpen] = useState(false);
  const [showTimestamps, setShowtimestamps] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [transcriptSettings, setTranscriptSettings] = React.useState({
    autoScroll: false,
    showHighlight: true,
  });
  const [showGlow, setShowGlow] = useState(false);

  const settingsAnchorRef = useRef(null);
  const notesAnchorRef = useRef(null);
  const transcriptRef = useRef<TranscriptRef>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const updateNotes = () => {
    const savedTranslations = JSON.parse(
      localStorage.getItem("savedTranslations") || "{}"
    );
    setSavedNotes(savedTranslations);
    setShowGlow(true);
    setTimeout(() => setShowGlow(false), 2000);
  };

  useEffect(() => {
    updateNotes();

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const updateEpisode = (index: number) => {
    setEpisodeNumber(index);
  };

  const settingsUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "darkMode") {
      setIsDarkMode(event.target.checked);
    } else if (event.target.name === "showTimestamps") {
      setShowtimestamps(event.target.checked);
    } else {
      setTranscriptSettings({
        ...transcriptSettings,
        [event.target.name]: event.target.checked,
      });
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

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <GlobalStyles />

      <div style={{ width: "100%", height: "100vh", overflowX: "hidden" }}>
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
            backgroundColor: "black",
          }}
        >
          <AppBar
            position="sticky"
            color="default"
            elevation={1}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderBottom: "1px solid #ccc",
              paddingLeft: "35px",
            }}
          >
            <Toolbar
              sx={
                {
                  // marginLeft: "-10px",
                }
              }
            >
              <AudioTrack
                pathToMp3={episodeTracks[episodeNumber]}
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
              backgroundColor: theme.palette.background.paper,
            }}
            onClick={() => setDrawerOpen(false)}
          >
            <Stack
              spacing={1}
              sx={{
                position: "fixed",
                top: "130px",
                right: "15px",
                zIndex: 2000,
              }}
            >
              <IconButton
                ref={settingsAnchorRef}
                onClick={() => setSettingsOpen((prev) => !prev)}
                sx={{
                  backgroundColor: isDarkMode ? "black" : "white",
                  color: isDarkMode ? "white" : "black",
                  borderRadius: "33%",
                  boxShadow: 3,
                  padding: "5px", // 25% smaller
                  "&:hover": {
                    backgroundColor: isDarkMode ? "grey" : "lightgrey",
                  },
                }}
              >
                <SettingsIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>

              <IconButton
                ref={notesAnchorRef}
                onClick={() => setNotesOpen((prev) => !prev)}
                sx={{
                  backgroundColor: isDarkMode
                    ? "black"
                    : showGlow
                    ? "#4a1a7b5c"
                    : "white",
                  color: isDarkMode ? "white" : "black",
                  boxShadow: showGlow ? 20 : 3,
                  borderRadius: "33%",
                  padding: "5px",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "grey" : "lightgrey",
                  },
                  transition: "box-shadow 0.3s ease-in-out",
                }}
              >
                <EditNoteIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>

              <IconButton
                onClick={() => setFlashcardsOpen((prev) => !prev)}
                sx={{
                  backgroundColor: isDarkMode
                    ? "black"
                    : showGlow
                    ? "#4a1a7b5c"
                    : "white",
                  color: isDarkMode ? "white" : "black",
                  boxShadow: showGlow ? 20 : 3,
                  borderRadius: "33%",
                  padding: "5px",
                  "&:hover": {
                    backgroundColor: isDarkMode ? "grey" : "lightgrey",
                  },
                  transition: "box-shadow 0.3s ease-in-out",
                }}
              >
                <StyleIcon sx={{ fontSize: "1.5rem" }} />
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
              isDarkMode={isDarkMode}
            />

            <SavedNotes isOpen={notesOpen} setNotesOpen={setNotesOpen} />

            <FlashCards isOpen={flashcardsOpen} setOpen={setFlashcardsOpen} />

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
    </ThemeProvider>
  );
};

export default LandingPage;
