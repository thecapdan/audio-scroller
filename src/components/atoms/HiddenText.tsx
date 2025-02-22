import { Box } from "@mui/material";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

interface HiddenItemProps {
  display: boolean;
  text: string;
}

const HiddenItem: React.FC<HiddenItemProps> = ({ display, text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          flex: 1,
          textAlign: "left",
          color: display || visible ? "black" : "transparent",
        }}
      >
        <Box component="span">{text}</Box>
      </Box>

      <SearchIcon
        sx={{ marginLeft: "auto" }} // Pushes the icon to the far right
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      />
    </Box>
  );
};

export default HiddenItem;
