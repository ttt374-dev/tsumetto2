import { problemFieldLabels } from "@/ui/features/problem/hooks/problemPresenter";
import { Grid, MenuItem, Select, TextField } from "@mui/material";

const UNSPECIFIED_SOURCE = "__UNSPECIFIED"

type SourceUi = string | typeof UNSPECIFIED_SOURCE
export function SourceFilterControl( {source, onChange, sources}: { 
    source: string | undefined,
    onChange: (source: string | undefined) => void
    sources: string[]
}){
    return (
        <TextField select value={source ?? UNSPECIFIED_SOURCE} fullWidth
            label={problemFieldLabels["source"]}
            onChange={e => onChange(e.target.value === UNSPECIFIED_SOURCE ? undefined : (e.target.value as string))}            
        >
            <MenuItem value={UNSPECIFIED_SOURCE}>（出典指定なし）</MenuItem>
            {sources.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
        </TextField>
    )
}