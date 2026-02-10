import { Box, Button, IconButton, List, ListItem, type SelectChangeEvent,  } from "@mui/material";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material"
import type { Deck } from "../DashboardScreen"

type DeckSelectMenuProps = {
  decks: Deck[]
  selectedDeckId?: string
  onSelect: (deck: Deck) => void
}

export function DeckSelectMenu({
  decks,
  selectedDeckId,
  onSelect,
}: DeckSelectMenuProps) {
  const handleChange = (e: SelectChangeEvent<string>) => {
    const deck = decks.find(d => d.id === e.target.value)
    if (deck) {
      onSelect(deck)
    }
  }

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="deck-select-label">
        デッキ
      </InputLabel>
      <Select
        labelId="deck-select-label"
        label="デッキ"
        value={selectedDeckId ?? ""}
        onChange={handleChange}
      >
        {decks.map(deck => (
          <MenuItem key={deck.id} value={deck.id}>
            {deck.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}