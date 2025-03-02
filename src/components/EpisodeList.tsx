import { useState } from "react";
import { List, ListItem, ListItemText, TextField } from "@mui/material";

interface EpisodeListProps {
  episodes: { [key: number]: any };
  selectEpisode: Function;
}

const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  selectEpisode,
}) => {
  const [filter, setFilter] = useState("");

  const items = Object.keys(episodes).map((key) => {
    const episode = episodes[Number(key)];
    const titleKey = Object.keys(episode.title)[0];
    return episode.title[titleKey];
  });

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <TextField
        label="Filter List"
        variant="outlined"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ paddingLeft: "10px" }}
      />
      <List>
        {filteredItems.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Episode ${index + 1}`}
              secondary={item}
              onClick={() => selectEpisode(index + 1)}
              sx={{ cursor: "pointer" }}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default EpisodeList;
