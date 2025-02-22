import React from "react";
import { Tooltip, styled } from "@mui/material";

import { TooltipProps } from "@mui/material/Tooltip";

const StyledSpan = styled("span")<{ size: string }>(({ size }) => {
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
    color: "darkblue",
    transition: "font-weight 0.2s ease-in-out", // Smooth transition effect
    "&:hover": {
      color: "#AA0000",
    },
  };
});

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    PopperProps={{
      modifiers: [{ name: "preventOverflow", options: { boundary: "window" } }],
    }}
    classes={{ popper: className }}
  />
))`
  & .MuiTooltip-tooltip {
    font-size: ${({ size }: { size: "Small" | "Medium" | "Large" }) =>
      size === "Small" ? "16px" : size === "Medium" ? "18px" : "24px"};
    background-color: rgb(231, 224, 224);
    color: #aa0000;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 8px;
  }

  & .MuiTooltip-arrow {
    color: #f5f5f9;
  }
`;

const WordWithTooltip: React.FC<{
  wordOrSentence: string;
  translation: string;
  size: "Small" | "Medium" | "Large";
  save: Function;
}> = ({ wordOrSentence, translation, size, save }) => {
  return (
    <StyledTooltip
      title={translation}
      size={size}
      arrow
      onClick={() => {
        save(wordOrSentence, translation);
      }}
    >
      <StyledSpan size={size}>{wordOrSentence}</StyledSpan>
    </StyledTooltip>
  );
};

export default WordWithTooltip;
