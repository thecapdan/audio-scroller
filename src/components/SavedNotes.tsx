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
import { Divider } from "@mui/material";

import { useMediaQuery } from "@mui/material";

const useResponsiveFontSize = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  return isMobile ? "0.8rem" : "1rem";
};

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
  maxWidth: "800px",
  maxHeight: "75vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const SavedNotes: React.FC<SavedNotesProps> = ({
  isOpen,
  setNotesOpen,
  notes,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [allNotes, setAllNotes] = useState<Record<string, string>[]>([]);
  const [spanishBase, setSpanishBase] = useState(true);
  const responsiveFontSize = useResponsiveFontSize();

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
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {allNotes.map((item, index) => {
                const [spanish, english] = Object.entries(item)[0];

                return (
                  <React.Fragment key={index}>
                    <ListItem
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        paddingY: 1,
                      }}
                    >
                      <Box sx={{ flex: 1, marginRight: 2 }}>
                        {" "}
                        {/* Added a container for the main text */}
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            fontSize: responsiveFontSize,
                          }}
                        >
                          {spanishBase ? spanish : english}
                        </Typography>
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        {" "}
                        {/* Added a container for HiddenItem */}
                        <HiddenItem
                          display={showAll}
                          text={spanishBase ? english : spanish}
                          fontSize={responsiveFontSize}
                        />
                      </Box>

                      <IconButton
                        edge="end"
                        onClick={() => removeFromNotes(spanish)}
                        sx={{ flexShrink: 0 }}
                      >
                        <CloseIcon />
                      </IconButton>
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
