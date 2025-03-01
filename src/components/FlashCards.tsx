import React, { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import {
  ClickAwayListener,
  Typography,
  Box,
  Modal,
  Button,
} from "@mui/material";

interface FlashCardsProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  notes: Record<string, string>[];
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  height: "70vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const cardContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
};

const topBarStyle = {
  position: "absolute",
  top: "10px",
  left: "10px",
};

const buttonContainerStyle = {
  position: "absolute",
  bottom: "10px",
  right: "10px",
  display: "flex",
  gap: "5px",
};

const smallButtonStyle = {
  transform: "scale(0.8)",
  transformOrigin: "bottom right",
};

const FlashCards: React.FC<FlashCardsProps> = ({ isOpen, setOpen, notes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showSpanishFirst, setShowSpanishFirst] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial state
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % notes.length);
  };

  const currentNote = notes.length ? notes[currentIndex] : {};
  const spanishSentence = notes.length ? Object.keys(currentNote)[0] : "";
  const englishTranslation = notes.length ? Object.values(currentNote)[0] : "";

  const cardStyle = {
    height: isSmallScreen ? "150px" : "300px",
    width: isSmallScreen ? "150px" : "300px",
    backgroundColor: "lightgrey",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Needed for positioning buttons
    borderRadius: "10px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
  };

  return (
    <Modal open={isOpen} onClose={() => {}}>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Box sx={topBarStyle}>
            <Button
              variant="outlined"
              onClick={() => setShowSpanishFirst((prev) => !prev)}
            >
              {showSpanishFirst ? "ES → EN" : "EN → ES"}
            </Button>
          </Box>
          {!notes.length ? (
            <p>
              You may click on the keywords in the transcript to create flash
              cards to help further your learning
            </p>
          ) : (
            <Box sx={cardContainerStyle}>
              <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                {/* FRONT SIDE */}
                <Box key="front" sx={cardStyle}>
                  <Typography variant="h5" sx={{ textAlign: "center" }}>
                    {showSpanishFirst ? spanishSentence : englishTranslation}
                  </Typography>
                  <Box sx={buttonContainerStyle}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => setIsFlipped(true)}
                      sx={smallButtonStyle}
                    >
                      Flip
                    </Button>
                  </Box>
                </Box>

                {/* BACK SIDE */}
                <Box key="back" sx={cardStyle}>
                  <Typography
                    variant={isSmallScreen ? "h6" : "h5"}
                    sx={{ textAlign: "center" }}
                  >
                    {showSpanishFirst ? englishTranslation : spanishSentence}
                    <Typography
                      variant={isSmallScreen ? "body2" : "subtitle1"}
                      sx={{ fontSize: "0.5em" }} // Make the text half the size of the parent
                    >
                      ({showSpanishFirst ? spanishSentence : englishTranslation}
                      )
                    </Typography>
                  </Typography>

                  <Box sx={buttonContainerStyle}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => setIsFlipped(false)}
                      sx={smallButtonStyle}
                    >
                      Flip
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={handleNext}
                      sx={smallButtonStyle}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </ReactCardFlip>
            </Box>
          )}
        </Box>
      </ClickAwayListener>
    </Modal>
  );
};

export default FlashCards;
