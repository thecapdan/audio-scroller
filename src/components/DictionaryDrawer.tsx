import React from "react";
import { Box, Button, Drawer, Typography } from "@mui/material";
import { ConjugationEntry } from "../dictionary";

interface DictionaryDrawerProps {
  highlightedWord: string;
  highlightedTranslation: string | ConjugationEntry;
  drawerOpen: boolean;
  toggleDrawer: Function;
  saveToNotes: Function;
}

const DictionaryDrawer: React.FC<DictionaryDrawerProps> = ({
  highlightedWord,
  highlightedTranslation,
  drawerOpen,
  toggleDrawer,
  saveToNotes,
}) => {
  return (
    <Drawer
      anchor="bottom"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          height: "160px",
          width: "30vw",
          minWidth: "220px",
          right: 0,
          marginLeft: "auto",
          border: "1px solid black",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          padding: "10px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {typeof highlightedTranslation === "object" &&
        highlightedTranslation !== null ? (
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {highlightedTranslation.esInfinitive} {/* Spanish word */}
            </Typography>
            <Typography variant="h6">
              {highlightedTranslation.engInfinitive}
            </Typography>
            <Typography>
              {`(${highlightedTranslation.conjugated} : ${highlightedTranslation.engConjugated})`}
            </Typography>
          </>
        ) : (
          <>
            {" "}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {highlightedWord} {/* Spanish word */}
            </Typography>
            <Typography variant="h6">{highlightedTranslation}</Typography>
          </>
        )}
        <Box sx={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Button
            variant="contained"
            size="small"
            onClick={toggleDrawer(false)}
          >
            Close
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              saveToNotes(highlightedWord, highlightedTranslation);
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default DictionaryDrawer;
