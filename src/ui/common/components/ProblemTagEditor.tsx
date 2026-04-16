import { problemFieldLabels } from "@/ui/features/problem/hooks/problemPresenter"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { Autocomplete, TextField } from "@mui/material"

type Props = {
    value: string[]
    onChange: (nextTags: string[]) => void
    label?: string
}

export function ProblemTagEditor({
    value,
    onChange,
    label = problemFieldLabels["tags"],
}: Props) {
    const allTags = useProblemStore(s=>s.allTags)
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
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder="タグを追加"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            const input = (e.target as HTMLInputElement).value
                            if (!input.trim()) return
                            if (!value.includes(input.trim())) {
                                onChange([...value, input.trim()])
                            }
                        }
                    }}
                    inputProps={{
                        ...params.inputProps,
                        enterKeyHint: "done",
                    }}
                />
            )}
        />
    )
}
