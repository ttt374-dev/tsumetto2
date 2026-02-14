import { Autocomplete, Chip, TextField } from "@mui/material"

type Props = {
    value: string[]
    allTags: string[]
    onChange: (nextTags: string[]) => void
    label?: string
}

export function ProblemTagEditor({
    value,
    allTags,
    onChange,
    label = "タグ",
}: Props) {
    return (
        <Autocomplete
            multiple
            freeSolo
            options={allTags}
            value={value}
            onChange={(_, newValue) => {
                // 重複除去 + trim
                const uniq = Array.from(
                    new Set(newValue.map(t => t.trim()).filter(Boolean))
                )
                onChange(uniq)
            }}
            renderTags={(tags, getTagProps) =>
                tags.map((tag, index) => (
                    <Chip
                        label={tag}
                        {...getTagProps({ index })}
                        key={tag}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder="タグを追加"
                />
            )}
        />
    )
}
