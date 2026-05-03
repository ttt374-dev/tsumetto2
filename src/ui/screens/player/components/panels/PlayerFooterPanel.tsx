import type { SolvedResult } from "@/domain/review/solvedResult"
import { Button, Stack, type ButtonProps } from "@mui/material"
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore"

type AnswerAction = {
    label: string
    result: SolvedResult
    color: ButtonProps['color']
    //secToTaken?: number
}

export function PlayerFooterPanel(props: {
    onNext: () => void
    onShowList: () => void
}) {
    
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