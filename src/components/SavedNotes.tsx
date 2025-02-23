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
  p: 2,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const SavedNotes: React.FC<SavedNotesProps> = ({
  isOpen,
  setNotesOpen,
  notes,
}) => {
  const theme = useTheme();

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
    console.log(sentence);
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
              ? "You may click on the key words to add notes here"
              : ""}
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
                          {spanishBase ? spanish : english}
                        </Typography>
                      </Box>
                      <HiddenItem
                        display={showAll}
                        text={spanishBase ? english : spanish}
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
