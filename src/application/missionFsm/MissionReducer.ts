import type { MissionAction, MissionState } from "./MissionFsm"

export const initialPosition: MissionState = {
  queue: [],
  currentIndex: 0,
  phase: "problem",
  isFinished: false,
  results: [],
}

export function missionReducer(state: MissionState, action: MissionAction): MissionState {
  switch (action.type) {    
    case "START":
      return {
        ...initialPosition,
        queue: action.payload.queue,
        currentIndex: action.payload.startIndex ?? 0,
      }

    case "SOLVE":  // 答えらたら次の問題へ移る
    case "FAIL": {
      const current = state.queue[state.currentIndex]
      if (!current) return state
      return {
        ...state,
        phase: "problem",
        currentIndex: state.currentIndex + 1,
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
      return initialPosition  // TODO

    default:
      return state
  }
}