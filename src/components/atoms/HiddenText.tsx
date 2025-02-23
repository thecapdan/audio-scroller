import { Box, Typography } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface HiddenItemProps {
  display: boolean;
  text: string;
  fontSize: string;
}

const HiddenItem: React.FC<HiddenItemProps> = ({ display, text, fontSize }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography
        sx={{
          flex: 1,
          textAlign: "left",
          color: display || visible ? "#161ed8" : "transparent",
          fontSize: fontSize,
          fontWeight: "bold",
          marginRight: 2,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </Typography>

      <SearchIcon
        sx={{ flexShrink: 0 }}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      />
    </Box>
  );
};

export default HiddenItem;
