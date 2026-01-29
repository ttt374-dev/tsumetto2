import {
  Box,
  Chip,
  TextField,
  Stack
} from "@mui/material"
import { useState } from "react"

type Props = {
  tags: string[]
  onChange: (tags: string[]) => void
}

export function ProblemTagEditor({ tags, onChange }: Props) {
  const [input, setInput] = useState("")

  const addTag = () => {
    const tag = input.trim()
    if (!tag || tags.includes(tag)) return
    onChange([...tags, tag])
    setInput("")
  }

  const removeTag = (tag: string) => {
    onChange(tags.filter(t => t !== tag))
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => removeTag(tag)}
            size="small"
          />
        ))}
      </Stack>

      <TextField
        size="small"
        label="タグ追加"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault()
            addTag()
          }
        }}
        sx={{ mt: 1 }}
      />
    </Box>
  )
}
