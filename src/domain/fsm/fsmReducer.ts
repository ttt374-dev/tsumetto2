import type { FsmAction, FsmState } from "./Fsm"

export const initialState: FsmState = {
  queue: [],
  currentIndex: 0,
  phase: "problem",
  isFinished: false,
  results: [],
}

export function fsmReducer(state: FsmState, action: FsmAction): FsmState {
  switch (action.type) {    
    case "START":
      return {
        ...initialState,
        queue: action.payload.queue,
        currentIndex: action.payload.startIndex ?? 0,
      }

    case "SOLVE":
    case "FAIL": {
      const current = state.queue[state.currentIndex]
      if (!current) return state
      return {
        ...state,
        phase: "answered",
        results: [
          ...state.results,
          { problemId: current.problemId, answerResult: action.type === "SOLVE" ? "solved" : "failed" },
        ],
      }
    }

    case "NEXT":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.queue.length),
        phase: "problem", // 次の問題に移ると phase はリセット
        isFinished: state.currentIndex === state.queue.length - 1
      }

    case "PREV":
      return {
        ...state,
        currentIndex: Math.max(state.currentIndex - 1, 0),
        phase: "problem",
      }

    case "FINISH_RUN":
      return {
        ...state,
        currentIndex: state.queue.length - 1,
        phase: "problem",
        isFinished: true,
      }
      break;    

    case "ADVANCE_PHASE":      
      const nextIndex = Math.min(state.currentIndex + ((state.phase === "solution") ? 1 : 0), state.queue.length)
      console.log("advance phase", state, nextIndex)
      return {
        ...state,
        phase: state.phase === "problem" ? "solution" : state.phase,
        currentIndex: nextIndex
      }

    case "RETREAT_PHASE":
      return {
        ...state,
        phase: state.phase === "solution" ? "problem" : state.phase,
      }

    case "RESET":
      return initialState  // TODO

    default:
      return state
  }
}