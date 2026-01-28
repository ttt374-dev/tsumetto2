import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Typography,
  Paper
} from "@mui/material"

export function TagCheckboxFilterControl({
  allTags,
  selectedTags,
  onChange,
}: {
    allTags: string[],
    selectedTags: string[],
    onChange: (tags: string[]) => void,
}) {

  const toggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag))
    } else {
      onChange([...selectedTags, tag])
    }
  }

  return (
    <Paper sx={{p:1}}>
      <Typography variant="subtitle2" gutterBottom>
        タグ
      </Typography>

    
      <FormGroup row>
        {allTags.map(tag => (
          <FormControlLabel
            key={tag}
            control={
              <Checkbox
                size="small"
                checked={selectedTags.includes(tag)}
                onChange={() => toggle(tag)}
              />
            }
            label={tag}
          />
        ))}
      </FormGroup>
    
    </Paper>
  )
}
