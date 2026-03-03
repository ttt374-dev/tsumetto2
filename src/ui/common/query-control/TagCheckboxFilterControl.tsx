import { FormGroup, Typography, Paper, Chip, FormLabel} from "@mui/material"

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
        <Paper sx={{
            m: 1, p: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
        }}>
            <FormLabel component="legend">タグ</FormLabel>
            <FormGroup row sx={{gap: 0.5}}>
                {allTags.map(tag => (
                    <Chip
                        key={tag}
                        label={tag}
                        clickable
                        color={selectedTags.includes(tag) ? "primary" : "default"}
                        onClick={() => toggle(tag)}
                    />
                ))}
            </FormGroup>
        </Paper>
    )
}
