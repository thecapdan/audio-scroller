import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

import {
  ClickAwayListener,
  List,
  ListItem,
  Typography,
  Box,
  Button,
  Modal,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HiddenItem from "./atoms/HiddenText";
import { Divider } from "@mui/material";

import { useMediaQuery } from "@mui/material";
import { ConjugationEntry } from "../dictionary";

const useResponsiveFontSize = () => {
  const isSmall = useMediaQuery("(max-width:500px)");
  const isMedium = useMediaQuery("(max-width:750px)");

  if (isSmall) {
    return "0.6rem";
  } else if (isMedium) {
    return "0.8rem";
  } else {
    return "1rem";
  }
};

interface SavedNotesProps {
  isOpen: boolean;
  setNotesOpen: (open: boolean) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  maxWidth: "800px",
  maxHeight: "75vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const SavedNotes: React.FC<SavedNotesProps> = ({ isOpen, setNotesOpen }) => {
  const theme = useTheme();

  const [showAll, setShowAll] = useState(false);
  const [allNotes, setAllNotes] = useState<
    Record<string, string | ConjugationEntry>[]
  >([]);
  const [spanishBase, setSpanishBase] = useState(true);
  const responsiveFontSize = useResponsiveFontSize();

  useEffect(() => {
    if (isOpen) {
      const savedTranslations = JSON.parse(
        localStorage.getItem("savedTranslations") || "{}"
      );
      console.log("savedTranslations");
      console.log(savedTranslations);
      const notesArray = Object.keys(savedTranslations).map((key) => ({
        [key]: savedTranslations[key],
      }));
      console.log("notesArray");
      console.log(notesArray);
      setAllNotes(notesArray);
    }
  }, [isOpen]);
  const removeFromNotes = (entry: string) => {
    const savedTranslations = JSON.parse(
      localStorage.getItem("savedTranslations") || "{}"
    );
    delete savedTranslations[entry];
    localStorage.setItem(
      "savedTranslations",
      JSON.stringify(savedTranslations)
    );

    setAllNotes((prevNotes) =>
      prevNotes.filter((note) => !note.hasOwnProperty(entry))
    );
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {}}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ClickAwayListener onClickAway={() => setNotesOpen(false)}>
        <Box sx={style}>
          {/* Title & Show All Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Notes
            </Typography>
            <SwapHorizIcon
              onClick={() => setSpanishBase(!spanishBase)}
              sx={{ "&:hover": { cursor: "pointer" } }}
            />
            <Button
              variant="contained"
              size="small"
              onClick={() => setShowAll((prev) => !prev)}
              sx={{
                width: "100px", // Adjust this value as needed
                minWidth: "max-content",
              }}
            >
              {showAll ? "Hide All" : "Show All"}
            </Button>
          </Box>

          {/* Scrollable List */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            {allNotes.length === 0
              ? "No words saved. To populate this list, highlight keywords in the transcript or click on the blue text"
              : ""}
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {allNotes.map((item, index) => {
                const [spanish, english] = Object.entries(item)[0] as [
                  string,
                  ConjugationEntry
                ];

                // Determine displayed values
                const isObject = typeof english === "object";
                const spanishText = isObject ? english.esInfinitive : spanish;
                const englishText = isObject ? english.engInfinitive : english;

                return (
                  <React.Fragment key={index}>
                    <ListItem
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        paddingY: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: "40%",
                          marginRight: 1,
                          overflow: "hidden",
                          minHeight: "40px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: responsiveFontSize,
                            overflow: "hidden",
                            width: "100%",
                          }}
                        >
                          {spanishBase ? spanishText : englishText}
                        </Typography>
                      </Box>
                      <HiddenItem
                        display={showAll}
                        text={spanishBase ? englishText : spanishText}
                        fontSize={responsiveFontSize}
                        remove={() => removeFromNotes(spanish)}
                        key={spanish}
                      />
                    </ListItem>
                    {index < allNotes.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        </Box>
      </ClickAwayListener>
    </Modal>
  );
};

export default SavedNotes;
