import { Grid, MenuItem, Select, TextField } from "@mui/material";
import { MateLengthFilterControl } from "./MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./TagCheckboxFilterControl";
import { FilterControl } from "./FilterControl";
import { type ProblemType } from "@/domain/problem/entity/Problem";
import type { FilterState } from "@/domain/problem/service/query/filter";
import { ProblemTypeFilterControl } from "./ProblemTypeControl";
import { UNSPECIFIED } from "./FilterControlPanel";


type SourceUi = string | typeof UNSPECIFIED
export function SourceFilterControl( {filter, addFilter, sources}: { 
    filter: FilterState,
    addFilter: (partial: Partial<FilterState>) => void    
    sources: string[]
}){
    return (
        <Select<SourceUi> value={filter.source ?? UNSPECIFIED} fullWidth
            onChange={e => addFilter({
                source: e.target.value === UNSPECIFIED ? undefined : (e.target.value as string),
            })}
        >
            <MenuItem value={UNSPECIFIED}>（出典指定なし）</MenuItem>
            {sources.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
        </Select>
    )
}