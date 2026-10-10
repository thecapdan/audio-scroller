import React, { useState, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import {
  ClickAwayListener,
  Typography,
  Box,
  Modal,
  Button,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { ConjugationEntry } from "../dictionary";

interface FlashCardsProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
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

const FlashCards: React.FC<FlashCardsProps> = ({ isOpen, setOpen }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allNotes, setAllNotes] = useState<
    Record<string, string | ConjugationEntry>[]
  >([]);

  const [isFlipped, setIsFlipped] = useState(false);
  const [showSpanishFirst, setShowSpanishFirst] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedTranslations = JSON.parse(
        localStorage.getItem("savedTranslations") || "{}"
      );
      const notesArray = Object.keys(savedTranslations).map((key) => ({
        [key]: savedTranslations[key] as string | ConjugationEntry,
      }));
      setAllNotes(notesArray);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allNotes.length);
    }, 200);
  };

  const renderTranslation = (
    translation: string | ConjugationEntry,
    showConjugatedToo = false
  ) => {
    if (typeof translation === "string") {
      return translation;
    } else {
      return (
        <Box>
          <Typography variant="h6">
            {translation.engConjugated}
            <br />
            {showConjugatedToo ? `(${translation.conjugated})` : ""}
          </Typography>
          <Typography variant="body2">
            {showConjugatedToo
              ? `Infinitive: ${translation.esInfinitive} (${translation.engInfinitive})`
              : ""}
          </Typography>
        </Box>
      );
    }
  };

  const removeFromNotes = (entry: string) => {
    console.log(entry);
    const savedTranslations = JSON.parse(
      localStorage.getItem("savedTranslations") || "{}"
    );
    delete savedTranslations[entry];
    localStorage.setItem(
      "savedTranslations",
      JSON.stringify(savedTranslations)
    );

    setTimeout(() => {
      setAllNotes((prevNotes) => {
        const updatedNotes = prevNotes.filter(
          (note) => !note.hasOwnProperty(entry)
        );

        if (updatedNotes.length === 0) {
          setCurrentIndex(0); // Reset index when all notes are deleted
        } else if (currentIndex >= updatedNotes.length) {
          setCurrentIndex(0); // Prevent out-of-bounds access
        }

        return updatedNotes;
      });
    }, 200);

    setIsFlipped(false); // Reset flip state
  };

  const currentNote = allNotes.length ? allNotes[currentIndex] : {};
  const spanishSentence = allNotes.length ? Object.keys(currentNote)[0] : "";
  const englishTranslation = allNotes.length
    ? Object.values(currentNote)[0]
    : "";

  const cardStyle = {
    height: isSmallScreen ? "150px" : "300px",
    width: isSmallScreen ? "150px" : "300px",
    backgroundColor: "lightgrey",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
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
          {!allNotes.length ? (
            <p style={{ padding: "20px" }}>
              No words saved. To populate the flash cards, highlight keywords in
              the transcript or click on the blue text
            </p>
          ) : (
            <Box sx={cardContainerStyle}>
              <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                {/* FRONT SIDE */}
                <Box key="front" sx={cardStyle}>
                  <Typography variant="h5" sx={{ textAlign: "center" }}>
                    {showSpanishFirst
                      ? spanishSentence
                      : renderTranslation(englishTranslation, false)}
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
                    {showSpanishFirst
                      ? renderTranslation(englishTranslation, true)
                      : spanishSentence}
                  </Typography>

                  <Box sx={buttonContainerStyle}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => removeFromNotes(spanishSentence)}
                      sx={smallButtonStyle}
                    >
                      <DeleteIcon />
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
