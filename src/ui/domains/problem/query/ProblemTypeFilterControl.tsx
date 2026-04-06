import { MenuItem, TextField } from "@mui/material";
import { PROBLEM_TYPES, type ProblemType } from "@/domain/problem/entity/ProblemType";
import { toProblemTypeText, } from "@/ui/domains/problem/hooks/problemPresenter";

const UNSPECIFIED_TYPE = "__UNSPECIFIED_TYPE"
const UNSPECIFIED_TYPE_LABEL = "（タイプ指定なし）"
type ProblemTypeUi = ProblemType | typeof UNSPECIFIED_TYPE

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

    // 指定なしを許可するかどうかを指定すること
export function ProblemTypeFilterControl( props: Props){
    const { problemType, onChange, allowUnspecified } = props

    const uiValue: ProblemTypeUi = allowUnspecified
        ? (problemType ?? UNSPECIFIED_TYPE)
        : problemType

    const options: {value: ProblemTypeUi, label: string}[] = []

    if (allowUnspecified) options.push({value: UNSPECIFIED_TYPE, label: UNSPECIFIED_TYPE_LABEL})
    
    PROBLEM_TYPES.map(type=> {        
        options.push({value: type as ProblemTypeUi, label: toProblemTypeText(type) })
    }
        
    )
        
    return (
        <TextField select value={uiValue} fullWidth
            label="問題タイプ"
            onChange={(e) => {
                const value = e.target.value

                if (allowUnspecified) {
                    if (value === UNSPECIFIED_TYPE) {
                        onChange(undefined)
                    } else {
                        onChange(value as ProblemType)
                    }
                } else {
                    onChange(value as ProblemType)
                }
            }}
        >
            { options.map(h=>(
                <MenuItem key={h.value} value={h.value}>{h.label}</MenuItem>
            )) }

        </TextField>

    )
}