import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { Container, Typography, useTheme } from "@mui/material";
import WordWithTooltip from "./TranslatedWords";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

interface TranscriptProps {
  title: Record<string, string>;
  text: string;
  translation: Record<string, string>;
  jumpTo: Function;
  timestamps: number[];
  settings: TranscriptSettings;
  onNotesUpdate: Function;
  imageName: string; // Updated: Accepts image name instead of full path
}

export interface TranscriptSettings {
  showHighlight: boolean;
  autoScroll: boolean;
}

const jumpButtonStyle = {
  padding: "0px",
  backgroundColor: "transparent",
  cursor: "pointer",
  border: "none",
};

export interface TranscriptRef {
  jumpToParagraph: (index: number) => void;
}

const Transcript = forwardRef<TranscriptRef, TranscriptProps>(
  (
    {
      title,
      text,
      translation,
      jumpTo,
      timestamps,
      settings,
      imageName,
      onNotesUpdate,
    },
    ref
  ) => {
    const theme = useTheme();

    const [spanishTitle, englishTitle] = Object.entries(title)[0];
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const paragraphRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const saveToNotes = (sentence: string, translation: string) => {
      const savedTranslations = JSON.parse(
        localStorage.getItem("savedTranslations") || "{}"
      );
      savedTranslations[sentence] = translation;
      localStorage.setItem(
        "savedTranslations",
        JSON.stringify(savedTranslations)
      );
      onNotesUpdate();
    };

    // Use Vite's method to resolve image URL dynamically
    useEffect(() => {
      if (imageName) {
        const imgUrl = new URL(
          `../assets/episodes/${imageName}.jpg`,
          import.meta.url
        ).href;
        setImageSrc(imgUrl);
      }
    }, [imageName]);

    const highlightParagraph = (index: number) => {
      Object.values(paragraphRefs.current).forEach((el) => {
        if (el) {
          el.style.backgroundColor = "transparent";
          el.style.borderRadius = "0";
        }
      });

      if (paragraphRefs.current[index]) {
        paragraphRefs.current[index]!.style.backgroundColor =
          "rgba(0, 0, 0, 0.05)";
        paragraphRefs.current[index]!.style.borderRadius = "5px";
      }
    };

    const processTextWithTooltips = (
      text: string,
      translations: Record<string, string>
    ) => {
      const regex = new RegExp(
        `(${Object.keys(translations).join("|")})`,
        "gi"
      );
      const parts = text.split(regex);

      return parts.map((part, index) => {
        const lowerCasePart = part.toLowerCase();
        const translationKey = Object.keys(translations).find(
          (key) => key.toLowerCase() === lowerCasePart
        );

        return translationKey ? (
          <WordWithTooltip
            key={index}
            translation={translations[translationKey]}
            wordOrSentence={part}
            size="Small"
            save={saveToNotes}
          />
        ) : (
          part
        );
      });
    };

    useImperativeHandle(ref, () => ({
      jumpToParagraph(index: number) {
        if (buttonRefs.current[index] && settings.autoScroll) {
          buttonRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        if (settings.showHighlight) {
          highlightParagraph(index);
        } else {
          highlightParagraph(-1);
        }
      },
    }));

    const renderTextWithLineBreaks = (
      text: string,
      translations: Record<string, string>
    ) => {
      const paragraphQty = text.split("\n").length - 1;
      const timestampQty = timestamps.length;

      return text.split("\n").map((line, index) => (
        <div
          key={index}
          ref={(el) => (paragraphRefs.current[index] = el)}
          style={{
            display: "inline",
            padding: "3px 0",
            margin: "-3px 0",
          }}
        >
          {processTextWithTooltips(line, translations)}
          <br />
          <br />
          {index < paragraphQty && index + 1 < timestampQty ? (
            <button
              ref={(el) => (buttonRefs.current[index + 1] = el)}
              style={jumpButtonStyle}
              onClick={() => {
                jumpTo(timestamps[index + 1]);
                highlightParagraph(index + 1);
              }}
            >
              <BookmarkBorderIcon />
            </button>
          ) : null}
        </div>
      ));
    };

    return (
      <Container
        sx={{
          backgroundColor: theme.palette.background.paper,
          marginLeft: "15px",
        }}
      >
        {/* Render the title with tooltip */}
        <Typography variant="h4" gutterBottom>
          <WordWithTooltip
            translation={englishTitle}
            wordOrSentence={spanishTitle}
            size="Large"
            save={saveToNotes}
          />
        </Typography>

        {/* Render the dynamically loaded image */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt={englishTitle}
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
              marginBottom: "16px",
            }}
          />
        )}

        {/* Render the transcript text */}
        <Typography variant="body1">
          <button
            ref={(el) => (buttonRefs.current[0] = el)}
            style={jumpButtonStyle}
            onClick={() => jumpTo(timestamps[0])}
          >
            {">"}
          </button>
          {renderTextWithLineBreaks(text, translation)}
        </Typography>
      </Container>
    );
  }
);

export default Transcript;
