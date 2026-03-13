import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { Button, Stack, type ButtonProps } from "@mui/material"
import { useSessionStore } from "@/ui/store/useSessionStore"

type AnswerAction = {
    label: string
    result: SolvedResult
    color: ButtonProps['color']
    //secToTaken?: number
}

const ANSWER_ACTIONS: AnswerAction[] = [
    //{ label: "Failed", result: "failed", color: "error" },
    //{ label: "Solved", result: "solved", color: "success" },
    //{ label: "Easy", result: "solved", color: "primary", secToTaken: 5 },
]

export function PlayerFooterPanel({  }: {
    //onAnswerClick: (answerResult: SolvedResult) => void,
}) {
    const next = useSessionStore(s => s.next)    
    const summary = useSessionStore(s=>s.summary)

    const handleNext = () => {
        next()
    }
    const handleSummary = () => {       
        
        summary()
        //alert("tdb")
    }
    return (
        <Stack direction="row">
            <Button onClick={handleSummary} fullWidth variant="outlined">
                サマリーへ
            </Button>
            <Button onClick={handleNext} fullWidth variant="contained">
                次へ
            </Button>
        </Stack>
    )

}