import { MenuItem, TextField } from "@mui/material";
import { UNSPECIFIED } from "./FilterControlPanel";
import type { ProblemType } from "@/domain/problem/entity/ProblemType";
import { ProblemTypeLabelMap } from "@/ui/problem/presenter/problemPresenter";

type ProblemTypeUi = ProblemType | typeof UNSPECIFIED

type Props =
  | {
      allowUnspecified: false
      problemType: ProblemType
      onChange: (type: ProblemType) => void
    }
  | {
      allowUnspecified: true
      problemType: ProblemType | undefined
      onChange: (type: ProblemType | undefined) => void
    }

export function ProblemTypeFilterControl( {problemType, onChange, allowUnspecified}: Props){
    return (
        <TextField select value={problemType ?? UNSPECIFIED} fullWidth
            label="問題タイプ"
            onChange={(e) => {
                if (allowUnspecified){
                    const value = e.target.value as ProblemTypeUi
                    onChange(value === UNSPECIFIED ? undefined : value)
                } else {
                    const value = e.target.value as ProblemType
                    onChange(value)
                }

                //addFilter({
                //    problemType: value === UNSPECIFIED ? undefined : value
                //})
            }}
        >
            { allowUnspecified && <MenuItem value={UNSPECIFIED}>（種類指定なし）</MenuItem>}
            { 
                Object.entries(ProblemTypeLabelMap).map(([k,v])=>(
                    <MenuItem key={k} value={v}>{v}</MenuItem>
                ))
            }
        </TextField>

    )
}