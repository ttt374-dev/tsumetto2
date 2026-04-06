import { useProblemStore } from "@/ui/store/useProblemStore"
import { FormGroup, Paper, Chip, FormLabel, FormControl} from "@mui/material"

export function TagCheckboxFilterControl({
    selectedTags,
    onChange,
}: {
    selectedTags: string[],
    onChange: (tags: string[]) => void,
}) {
    const allTags = useProblemStore(s=>s.allTags)    
    const toggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onChange(selectedTags.filter(t => t !== tag))
        } else {
            onChange([...selectedTags, tag])
        }
    }
    return (
        <FormControl fullWidth>
            <FormLabel>タグ</FormLabel>
            <Paper variant="outlined" sx={{ p: 1.5 }}>
                <FormGroup row sx={{ gap: 0.5 }}>
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
        </FormControl>
    )

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
