import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Container, Typography } from "@mui/material";
import WordWithTooltip from "./TranslatedWords";

interface TranscriptProps {
  title: Record<string, string>;
  text: string;
  translation: Record<string, string>;
  jumpTo: Function;
  timestamps: number[]
}

const jumpButtonStyle = { lineHeight: "20px", width: "20px", minWidth: "20px", padding: "0" }

export interface TranscriptRef {
  jumpToParagraph: (index: number) => void;
}

const Transcript = forwardRef<TranscriptRef, TranscriptProps>(
    ({ title, text, translation, jumpTo, timestamps }, ref) => {  const [spanishTitle, englishTitle] = Object.entries(title)[0];
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);


  const processTextWithTooltips = (text: string, translations: Record<string, string>) => {
    const regex = new RegExp(`(${Object.keys(translations).join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      translations[part] ? (
        <WordWithTooltip
          key={index}
          translation={translations[part]}
          wordOrSentence={part}
          size="Small"
        />
      ) : (
        part
      )
    );
  };


  useImperativeHandle(ref, () => ({
    jumpToParagraph(index: number) {
        if (buttonRefs.current[index]) {
            buttonRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
          }
    },
  }));


  const renderTextWithLineBreaks = (text: string, translations: Record<string, string>) => {
    const paragraphQty = text.split("\n").length -1;
    const timestampQty = timestamps.length;
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {processTextWithTooltips(line, translations)}
        <br /><br />{index < paragraphQty && index+1 < timestampQty ? <button  ref={(el) => (buttonRefs.current[index+1] = el)} style={jumpButtonStyle} onClick={() => jumpTo(timestamps[index+1])}>{">"}</button>: ""}

      </React.Fragment>
    ));
  };

  return (
    <Container>
      {/* Render the title with tooltip */}
      <Typography variant="h4" gutterBottom>
        <WordWithTooltip
          translation={englishTitle}
          wordOrSentence={spanishTitle}
          size="Large"
        />
      </Typography>
      {/* Render the text with tooltips for translatable parts */}
      <Typography variant="body1">
      <button ref={(el) => (buttonRefs.current[0] = el)} style={jumpButtonStyle}  onClick={() => jumpTo(timestamps[0])} 
      >{">"}</button>
        {renderTextWithLineBreaks(text, translation)}
      </Typography>
    </Container>
  );
});

export default Transcript;
