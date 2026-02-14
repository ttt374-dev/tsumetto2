import type { SolvedResult } from "@/domain/learning/Learning"
import { Button, Stack, type ButtonProps, type Color, type PaletteColor } from "@mui/material"

type AnswerAction = {
  label: string
  result: SolvedResult
  color:  ButtonProps['color']
  //secToTaken?: number
}

const ANSWER_ACTIONS: AnswerAction[] = [
  { label: "Failed", result: "failed", color: "error" },
  { label: "Solved", result: "solved", color: "success" },
  //{ label: "Easy", result: "solved", color: "primary", secToTaken: 5 },
]

export function PlayerAnswerActions({onAnswerClick}: {
    onAnswerClick: (answerResult: SolvedResult) => void,    
}){
  const height = "64px"
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