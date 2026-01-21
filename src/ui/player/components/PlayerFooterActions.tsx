import type { SolvedResult } from "@/domain/mission/MissionSummary"
import { Button, Stack } from "@mui/material"

type AnswerAction = {
  label: string
  result: SolvedResult
  secToTaken?: number
}

const ANSWER_ACTIONS: AnswerAction[] = [
  { label: "Failed", result: "failed" },
  { label: "Solved", result: "solved" },
  { label: "Easy", result: "solved", secToTaken: 5 },
]

export function PlayerFooterActions({onAnswer}: {
    onAnswer: (answerResult: SolvedResult, secToTaken?: number) => void,    
}){
return (
    <Stack direction="row" spacing={1}>
      {ANSWER_ACTIONS.map(({ label, result, secToTaken }) => (
        <Button
          key={label}
          fullWidth
          variant="contained"
          onClick={() => onAnswer(result, secToTaken)}
        >
          {label}
        </Button>
      ))}
    </Stack>
  )
}