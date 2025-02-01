import React, { useRef, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  AppBar,
  Toolbar,
} from "@mui/material";
import Transcript, { TranscriptRef } from "./components/Transcript";

import mp3File from "./assets/episode_1/recording.m4a"

import episode from "./assets/episode_1/AC Page 1.json"
import AudioTrack, { AudioTrackRef } from "./components/AudioTrack";

const LandingPage: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [items] = useState(["Episode 1: Agatha Christie disappearence", "Episode 2: The Gunpowder Plot", "Episode 3", "Episode 4"]);
  const audioTrackRef = useRef<AudioTrackRef>(null);
  const transcriptRef = useRef<TranscriptRef>(null);


  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase())
  );

  const handleTrackJump = (timestamp: number) => {
    if (audioTrackRef.current) {
      audioTrackRef.current.handleJumpToTimestamp(timestamp);
    }
  };



  const paragraphHop = (index: number) => {
    console.log("Tell transcript to jump to this paragraph:", index);
    transcriptRef.current?.jumpToParagraph(index); // Call the method in Transcript
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        sx={{
          width: "15%",
          borderRight: "1px solid #ccc",
          p: 2,
          overflowY: "auto",
        }}
      >
        <TextField
          label="Filter List"
          variant="outlined"
          fullWidth
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 2 }}
        />
        <List>
          {filteredItems.map((item, index) => (
            <ListItem key={index}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Right Section: Main Content */}
      <Box sx={{ width: "85%", display: "flex", flexDirection: "column" }}>
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
            <AudioTrack pathToMp3={mp3File} timestamps={episode.timestamps} positionJump={paragraphHop} ref={audioTrackRef} />
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            padding: 3,
            backgroundColor: "#fafafa",
          }}
        >
         <Transcript title={episode.title} text={episode.text} translation={episode.translations} jumpTo={handleTrackJump} timestamps={episode.timestamps} ref={transcriptRef}/>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
