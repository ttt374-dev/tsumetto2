

export type FsmState = {
  queue: QueueItem[]
  currentIndex: number
  phase: PlayerPhase
  //plyIndex: number
  isFinished: boolean
  results: { problemId: string; answerResult: AnswerResult }[]
}

// FSM actions
export type FsmAction =
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

type AnswerQuality = "easy" | "medium" | "hard"

export type AnswerEntry = {
    problemId: string
    answerResult: AnswerResult,
    //secTaken: number,
    //answerQuality: AnswerQuality,
}

export type PlayerPhase = "problem" | "solution" | "answered"

export type AnswerResult = "solved" | "failed"