import React from "react";
import { Tooltip, styled } from "@mui/material";

type Size = "Small" | "Medium" | "Large";

interface WordWithTooltipProps {
  wordOrSentence: string;
  translation: string;
  size: Size;
}

const StyledSpan = styled("span")<{ size: Size }>(({ size }) => {
  let fontSize;
  switch (size) {
    case "Small":
      fontSize = "16px";
      break;
    case "Medium":
      fontSize = "18px";
      break;
    case "Large":
      fontSize = "24px";
      break;
    default:
      fontSize = "14px";
  }
  return {
    cursor: "pointer",
    fontSize,
    fontWeight: "bold",
  };
});

const StyledTooltip = styled(Tooltip)<{ size: Size }>(({ size }) => ({
  tooltip: {
    fontSize: size === "Small" ? "10px" : size === "Medium" ? "14px" : "18px",
    backgroundColor: "#f5f5f9",
    color: "#000",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "4px",
    padding: "8px",
  },
}));

const WordWithTooltip: React.FC<WordWithTooltipProps> = ({
  wordOrSentence,
  translation,
  size,
}) => {
  return (
    <StyledTooltip title={translation} size={size} arrow>
      <StyledSpan size={size}>{wordOrSentence}</StyledSpan>
    </StyledTooltip>
  );
};

export default WordWithTooltip;
