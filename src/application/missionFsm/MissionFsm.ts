

export type MissionState = {
  queue: QueueItem[]
  currentIndex: number
  phase: PlayerPhase
  isFinished: boolean
  results: { problemId: string; answerResult: SolvedResult }[]
}

// FSM actions
export type MissionAction =
  | { type: "START"; payload: { queue: QueueItem[]; startIndex?: number } }
  | { type: "SOLVE" }
  | { type: "FAIL" }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "FINISH_RUN"}
  | { type: "ADVANCE_PHASE" }
  | { type: "RETREAT_PHASE" }
  //| { type: "ADVANCE_PLY"}
  //| { type: "RETREAT_PLY"}
  | { type: "RESET" }

  export type QueueItem = {
  problemId: string
}

//type AnswerQuality = "easy" | "medium" | "hard"

export type AttemptRecord = {
    problemId: string
    solvedResult: SolvedResult,
    //secTaken: number,
    //answerQuality: AnswerQuality,
}

export type PlayerPhase = "problem" | "solution" | "answered"

export type SolvedResult = "solved" | "failed"