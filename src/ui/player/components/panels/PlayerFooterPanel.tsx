import type { SolvedResult } from "@/domain/review/solvedResult"
import { Button, Stack, type ButtonProps } from "@mui/material"
import { useSessionStore } from "@/ui/session/hooks/useSessionStore"
import { useGameStore } from "@/ui/player/store/useGameStore"

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

export function PlayerFooterPanel(props: {
    //onAnswerClick: (answerResult: SolvedResult) => void,    
    onNext: () => void
    onShowList: () => void
    //onSummary: () => void
}) {
    const summary = useSessionStore(s=>s.summary)

    const handleSummary = () => {               
        summary()
        
    }
    return (
        <Stack direction="row">
            <Button onClick={props.onShowList} fullWidth variant="outlined">
                問題リスト
            </Button>
            
            
            <Button onClick={props.onNext} fullWidth variant="contained">
                次へ
            </Button>
        </Stack>
    )

}