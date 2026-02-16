import { FormGroup, Typography, Paper, Chip} from "@mui/material"

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
        <Paper sx={{ m: 1, p: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
                タグ
            </Typography>

            <FormGroup row>
                {allTags.map(tag => (

                    <Chip
                        key={tag}
                        label={tag}
                        clickable
                        color={selectedTags.includes(tag) ? "primary" : "default"}
                        onClick={() => toggle(tag)}
                    />
                    /*
                    <Checkbox
                      size="small"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggle(tag)}
                    />*/

                ))}
            </FormGroup>

        </Paper>
    )
}
