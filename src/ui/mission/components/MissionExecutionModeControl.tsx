import { Box, Checkbox, FormControlLabel, TextField } from "@mui/material"
import { useRef } from "react"

export type MissionExecutionMode =
  | { type: "full" }
  | { type: "partial", limit: number }

export const DefaultMissionExecutionMode: MissionExecutionMode = { type: "partial", limit: 10}

export function ExecutionModeControl(props: {
    value: MissionExecutionMode
    onChange: (mode: MissionExecutionMode) => void
}) {
    const { value, onChange } = props

    const lastLimitRef = useRef(10)
    const isPartial = value.type === "partial"
    const limit = isPartial ? value.limit : lastLimitRef.current

    return (
        <Box>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isPartial}
                        onChange={(e) => {
                            if (e.target.checked) {
                                // ON → 前回の値を復元
                                onChange({
                                    type: "partial",
                                    limit: lastLimitRef.current
                                })
                            } else {
                                // OFF → fullへ
                                onChange({ type: "full" })
                            }
                        }}
                    />
                }
                label={
                    isPartial ? (
                        <>
                            最初の
                            <TextField
                                type="number"
                                size="small"
                                value={limit}
                                onChange={(e) => {
                                    const newLimit = Math.max(1, Number(e.target.value) || 1)

                                    // ⭐ 最新値を保持
                                    lastLimitRef.current = newLimit

                                    onChange({
                                        type: "partial",
                                        limit: newLimit
                                    })
                                }}
                                sx={{ width: 60, mx: 1 }}
                                inputProps={{ min: 1 }}
                            />
                            問のみ
                        </>
                    ) : (
                        "最初の10問のみ"
                    )
                }
            />
        </Box>
    )
}