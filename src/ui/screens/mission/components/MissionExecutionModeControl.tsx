import { NumericInput } from "@/ui/shared/components/NumericInput"
import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material"

export type MissionExecutionMode = "full" | "partial"

export function ExecutionModeControl(props: {
    mode: MissionExecutionMode,
    limit: number,
    onChange: (mode: MissionExecutionMode, limit: number) => void
}) {    
    const isPartial = props.mode === "partial"
    const label = isPartial ? (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            最初の
            <NumericInput 
                value={props.limit} 
                onChange={v=>props.onChange(props.mode, v)} 
                sx={{ width: 60, mx: 1}}
            />
            問のみ
        </Box>
    ) : (
        `最初の${props.limit}問のみ`
    )
    return (
        <Box>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isPartial}
                        onChange={(e) => {
                            const m = e.target.checked ? "partial" : "full"
                            props.onChange(m, props.limit)                            
                        }}
                    />
                }
                label={label}
            />
        </Box>
    )
}