import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { type ProblemType } from "@/domain/problem/entity/Problem";
import { UNSPECIFIED } from "./FilterControlPanel";

type ProblemTypeUi = ProblemType | typeof UNSPECIFIED
export function ProblemTypeFilterControl( {problemType, onChange}: { 
    problemType: ProblemType | undefined,
    onChange: (type: ProblemType | undefined) => void
    //addFilter: (partial: Partial<FilterState>) => void    
}){
    return (
        <TextField select value={problemType ?? UNSPECIFIED} fullWidth
            label="問題タイプ"
            onChange={(e) => {
                const value = e.target.value as ProblemTypeUi
                onChange(value === UNSPECIFIED ? undefined : value)
                //addFilter({
                //    problemType: value === UNSPECIFIED ? undefined : value
                //})
            }}
        >
            <MenuItem value={UNSPECIFIED}>（種類指定なし）</MenuItem>
            <MenuItem key="standard" value="standard">標準</MenuItem>
            <MenuItem key="realistic" value="realistic">実践</MenuItem>
            <MenuItem key="hisshi" value="hisshi">必死</MenuItem>
            <MenuItem key="tesuji" value="tesuji">手筋</MenuItem>
        </TextField>

    )
}