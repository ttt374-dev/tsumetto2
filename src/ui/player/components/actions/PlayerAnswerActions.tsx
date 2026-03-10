import type { SolvedResult } from "@/domain/learning/entity/Learning"
import { Button, Stack, type ButtonProps } from "@mui/material"
import { useReplayStore } from "../../hooks/useReplayStore"
import { useSessionStore } from "@/ui/store/useSessionStore"

type AnswerAction = {
  label: string
  result: SolvedResult
  color:  ButtonProps['color']
  //secToTaken?: number
}

const ANSWER_ACTIONS: AnswerAction[] = [
  //{ label: "Failed", result: "failed", color: "error" },
  //{ label: "Solved", result: "solved", color: "success" },
  //{ label: "Easy", result: "solved", color: "primary", secToTaken: 5 },
]

export function PlayerAnswerActions({onAnswerClick}: {
    onAnswerClick: (answerResult: SolvedResult) => void,    
}){
  const next = useSessionStore(s=>s.next)

  const handleNext = () => {
    next()
  }
  const handleSummary = () => {
    alert("tdb")
  }
  return (
    <Stack direction="row">
      <Button onClick={handleSummary} fullWidth>
        サマリーへ
      </Button>
      <Button onClick={handleNext} fullWidth variant="outlined">
        次へ
      </Button>
    </Stack>
  )
  const height = "32px"
  return (  
    <Stack direction="row" spacing={1}>
      {ANSWER_ACTIONS.map(({ label, result, color }) => (
        <Button
          key={label}
          fullWidth
          color={color}
          variant="contained"
          sx={{height: height}}
          onClick={() => { onAnswerClick(result)}}
        >
          {label}
        </Button>
      ))}
    </Stack>
  )
}