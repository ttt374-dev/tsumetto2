import { Grid, MenuItem, Select, TextField } from "@mui/material";
import { MateLengthFilterControl } from "./MateLengthFilterControl";
import { TagCheckboxFilterControl } from "./TagCheckboxFilterControl";
import { FilterControl } from "./FilterControl";
import { type ProblemType } from "@/domain/problem/entity/Problem";
import type { FilterState } from "@/domain/problem/service/query/filter";
import { UNSPECIFIED } from "./FilterControlPanel";

type ProblemTypeUi = ProblemType | typeof UNSPECIFIED
export function ProblemTypeFilterControl( {filter, addFilter}: { 
    filter: FilterState,
    addFilter: (partial: Partial<FilterState>) => void    
}){
    return (
        <Select<ProblemTypeUi> value={filter.problemType ?? UNSPECIFIED} fullWidth
            onChange={(e) => {
                const value = e.target.value as ProblemTypeUi
                addFilter({
                    problemType: value === UNSPECIFIED ? undefined : value
                })
            }}
        >
            <MenuItem value={UNSPECIFIED}>（種類指定なし）</MenuItem>
            <MenuItem key="standard" value="standard">標準</MenuItem>
            <MenuItem key="realistic" value="realistic">実践</MenuItem>
            <MenuItem key="hisshi" value="hisshi">必死</MenuItem>
        </Select>
    )
}