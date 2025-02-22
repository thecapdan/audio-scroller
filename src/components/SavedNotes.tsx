import React, { useState, useEffect } from "react";
import {
  ClickAwayListener,
  List,
  ListItem,
  IconButton,
  Typography,
  Box,
  Button,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import HiddenItem from "./atoms/HiddenText";

interface SavedNotesProps {
  isOpen: boolean;
  setNotesOpen: (open: boolean) => void;
  notes: Record<string, string>;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  maxHeight: "75vh", // Limit modal height to 75% of viewport height
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column", // Ensures the title and list are stacked properly
  overflow: "hidden", // Prevents overflow outside modal
};

const SavedNotes: React.FC<SavedNotesProps> = ({
  isOpen,
  setNotesOpen,
  notes,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [allNotes, setAllNotes] = useState<Record<string, string>[]>([]);
  const [spanishBase, setSpanishBase] = useState(true);

  useEffect(() => {
    const translationsArr = Object.entries(notes).map(
      ([sentence, translation]) => ({ [sentence]: translation })
    );
    setAllNotes(translationsArr);
  }, [notes]);

  const removeFromNotes = (sentence: string) => {
    const savedTranslations = JSON.parse(
      localStorage.getItem("savedTranslations") || "{}"
    );
    delete savedTranslations[sentence];
    localStorage.setItem(
      "savedTranslations",
      JSON.stringify(savedTranslations)
    );

    setAllNotes((prevNotes) =>
      prevNotes.filter((note) => !note.hasOwnProperty(sentence))
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
            >
              {showAll ? "Hide All" : "Show All"}
            </Button>
          </Box>

          {/* Scrollable List */}
          <Box
            sx={{
              flexGrow: 1, // Allows list to grow and take available space
              overflowY: "auto", // Enables vertical scrolling when needed
            }}
          >
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {allNotes.map((item, index) => {
                const [spanish, english] = Object.entries(item)[0];

                return (
                  <ListItem
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingY: 1,
                    }}
                  >
                    {/* Spanish Text - Always Visible */}
                    <Typography sx={{ flex: 1, fontWeight: "bold" }}>
                      {spanishBase ? spanish : english}
                    </Typography>

                    <HiddenItem
                      display={showAll}
                      text={spanishBase ? english : spanish}
                    />

                    {/* X Button - Removes Item */}
                    <IconButton
                      edge="end"
                      onClick={() => removeFromNotes(spanish)}
                      sx={{ flex: "0 0 auto" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItem>
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
