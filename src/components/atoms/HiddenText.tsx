import { Box, IconButton, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface HiddenItemProps {
  display: boolean;
  text: string;
  remove: Function;
  fontSize: string;
}

const HiddenItem: React.FC<HiddenItemProps> = ({
  display,
  text,
  fontSize,
  remove,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Box
      sx={{
        width: "50%",
        marginRight: 1,
        overflow: "hidden",
        minHeight: "40px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          flex: 1,
          textAlign: "left",
          color: display || visible ? "#161ed8" : "transparent",
          fontSize: fontSize,
          fontWeight: "bold",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {text}
      </Typography>

      <SearchIcon
        sx={{ flexShrink: 0, fontSize: "1.3rem" }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      />
      <IconButton
        // edge="end"
        onClick={() => remove()}
        sx={{ flexShrink: 0, padding: 0, fontSize: "1rem" }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default HiddenItem;
