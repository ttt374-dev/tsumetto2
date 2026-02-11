import type { SolvedResult } from "@/domain/learning/Learning"
import { Button, Stack, type ButtonProps, type Color, type PaletteColor } from "@mui/material"

type AnswerAction = {
  label: string
  result: SolvedResult
  color:  ButtonProps['color']
  secToTaken?: number
}

const ANSWER_ACTIONS: AnswerAction[] = [
  { label: "Failed", result: "failed", color: "error" },
  { label: "Solved", result: "solved", color: "success" },
  //{ label: "Easy", result: "solved", color: "primary", secToTaken: 5 },
]

export function PlayerFooterActions({onAnswer}: {
    onAnswer: (answerResult: SolvedResult, secToTaken?: number) => void,    
}){
  const height = "64px"
  return (  
    <Stack direction="row" spacing={1}>
      {ANSWER_ACTIONS.map(({ label, result, color, secToTaken }) => (
        <Button
          key={label}
          fullWidth
          color={color}
          variant="contained"
          sx={{height: height}}
          onClick={() => { onAnswer(result, secToTaken)}}
        >
          {label}
        </Button>
      ))}
    </Stack>
  )
}