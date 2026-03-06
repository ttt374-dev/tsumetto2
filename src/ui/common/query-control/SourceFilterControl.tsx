import { Grid, MenuItem, Select, TextField } from "@mui/material";
import { MateLengthFilterControl } from "./MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./TagCheckboxFilterControl";
import { BooleanFilterControl } from "./BooleanFilterControl";
import { type ProblemType } from "@/domain/problem/entity/Problem";
import type { FilterState } from "@/domain/problem/service/query/filter";
import { ProblemTypeFilterControl } from "./ProblemTypeFilterControl";
import { UNSPECIFIED } from "./FilterControlPanel";


type SourceUi = string | typeof UNSPECIFIED
export function SourceFilterControl( {source, onChange, sources}: { 
    source: string | undefined,
    onChange: (source: string | undefined) => void
    sources: string[]
}){
    return (
        <TextField select value={source ?? UNSPECIFIED} fullWidth
            label="出典"
            onChange={e => onChange(e.target.value === UNSPECIFIED ? undefined : (e.target.value as string))}            
        >
            <MenuItem value={UNSPECIFIED}>（出典指定なし）</MenuItem>
            {sources.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
        </TextField>
    )
}