import type { AnswerEntry, MissionState } from "@/application/missionFsm/MissionFsm";
import { Box, Button, Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const summaryResult = (results: AnswerEntry[]) => {
    const values = results
    const solved = values.filter(v => v.answerResult === "solved").length;
    const failed = values.filter(v => v.answerResult === "failed").length;

    return {
        totalAnswered: values.length,
        solved,
        failed,

        accuracy: values.length ? solved / values.length
            //? Math.round((solved / values.length) * 100 / 100)
            : 0,
    };
}
function SummaryRow({
    label,
    value,
    highlight = false,
}: {
    label: string
    value: React.ReactNode
    highlight?: boolean
}) {
    return (
        <Stack direction="row" justifyContent="space-between">
            <Box>{label}</Box>
            <Box
                sx={{
                    fontWeight: highlight ? "bold" : "normal",
                    fontSize: highlight ? 18 : 14,
                }}
            >
                {value}
            </Box>
        </Stack>
    )
}
export function SummaryScreen(){
    const location = useLocation();
    const locationState = location.state as { fsmState?: MissionState } | null;
    const fsmState = locationState?.fsmState;

    
    useEffect(() => {
        if (!fsmState) {
            navigate("/dashboard");
        }
    }, [fsmState]);

    if (!fsmState) return null; // セーフティレンダリング
     const summary = summaryResult(fsmState.results)   
    const navigate = useNavigate()

    return (
        <>
            <Box>
                Done. Good Job
            </Box>

            <Stack spacing={2} p={2}>
                        <SummaryRow label="正解" value={summary.solved} />
                        <SummaryRow label="不正解" value={summary.failed} />
                        <SummaryRow label="正解率" value={`${Math.round(summary.accuracy * 100)} %`} />
                    </Stack>

            <Button onClick={() => { navigate("/dashboard")}}>
                Dashboard
            </Button>
        </>
    )
}