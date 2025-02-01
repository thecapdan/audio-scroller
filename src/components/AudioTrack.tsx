import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Box, Slider, IconButton, Typography, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

interface AudioTrackProps {
  pathToMp3: string;
  timestamps: number[];
  positionJump: Function;
}

export interface AudioTrackRef {
    handleJumpToTimestamp: (timestamp: number) => void;
}

const AudioTrack = forwardRef<AudioTrackRef, AudioTrackProps>(
    ({ pathToMp3, timestamps, positionJump }, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Update the current time as the audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime;
      setCurrentTime(newTime);
  
      // Find the closest timestamp that is still ahead
      for (let i = timestamps.length - 1; i >= 0; i--) {
        if (newTime >= timestamps[i]) {
          positionJump(i); // Notify transcript to highlight the paragraph
          break;
        }
      }
    }
  };
  

  // Expose handleJumpToTimestamp to the parent through ref
  useImperativeHandle(ref, () => ({
    handleJumpToTimestamp,
  }));

  // Set duration when the audio is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleJumpToTimestamp = (timestamp: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestamp;
    }
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    if (audioRef.current) {
      const newTime = Array.isArray(value) ? value[0] : value;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  return (
<Box sx={{ width: "100%", position: "relative" }}>
  {/* Audio element */}
  <audio
    ref={audioRef}
    src={pathToMp3}
    onTimeUpdate={handleTimeUpdate}
    onLoadedMetadata={handleLoadedMetadata}
    controls
    style={{ display: "none" }}
  />

  {/* Play/Pause Button and Speed Control Buttons Aligned to the Left */}
  <Box
    display="flex"
    alignItems="center"
    justifyContent="flex-start" // Align buttons to the left
    mb={1}
    gap={2}
  >
    {/* Play/Pause Button */}
    <IconButton onClick={togglePlayPause} aria-label="play/pause">
      {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
    </IconButton>

    {/* Speed Control Buttons */}
    <Button
      variant="contained"
      size="small"
      onClick={() => handleSpeedChange(0.75)}
    >
      Slow
    </Button>
    <Button
      variant="contained"
      size="small"
      onClick={() => handleSpeedChange(1)}
    >
      Normal
    </Button>
    <Button
      variant="contained"
      size="small"
      onClick={() => handleSpeedChange(1.25)}
    >
      Fast
    </Button>
  </Box>

      {/* Progress bar */}
      <Box sx={{ position: "relative", width: "100%", mb: 2 }}>
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSliderChange}
          aria-labelledby="audio-progress-slider"
        />
      </Box>

      {/* Timestamp buttons */}
      <Box
        display="flex"
        justifyContent="space-between"
        mt={1}
        sx={{ position: "relative" }}
      >
        {timestamps.map((timestamp, index) => {
          const position = (timestamp / duration) * 100;
          return (
            <Button
              key={index}
              variant="contained"
              size="small"
              sx={{
                position: "absolute",
                top: "-20px", 
                left: `${position}%`,
                transform: "translateX(-50%)",
                padding: "2px 2px",
                fontSize: "8px",
                minWidth: "30px",
              }}
              onClick={() => { handleJumpToTimestamp(timestamp), positionJump(index)}}
            >
              {index + 1} {/* Display index instead of timestamp */}
            </Button>
          );
        })}

      </Box>

      {/* Display current time and duration */}
      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="body2">
          {new Date(currentTime * 1000).toISOString().substr(14, 5)}
        </Typography>
        <Typography variant="body2">
          {new Date(duration * 1000).toISOString().substr(14, 5)}
        </Typography>
      </Box>
    </Box>
  );
});

export default AudioTrack;
