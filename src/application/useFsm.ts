// useFSM.ts
import { useReducer } from "react"
import { fsmReducer, initialState } from "@/domain/fsm/fsmReducer"
import type { QueueItem } from "@/domain/fsm/Fsm"
import type { Problem } from "@/domain/problem/Problem"

export const buildQueue = (problems: Problem[]): QueueItem[] => {       
    return problems.map((p) => ({problemId: p.id}))
    
}
export function useFsm() {
  const [state, dispatch] = useReducer(fsmReducer, initialState)

  // ラッパー
  const start = (queue: QueueItem[], startIndex?: number) => {
    console.log("start fsm", queue, startIndex)
    dispatch({ type: "START", payload: { queue, startIndex } })
  }
  const solve = () => dispatch({ type: "SOLVE" })
  const fail = () => dispatch({ type: "FAIL" })
  const next = () => dispatch({ type: "NEXT" })
  const prev = () => dispatch({ type: "PREV" })
  const advancePhase = () => dispatch({ type: "ADVANCE_PHASE" })
  const retreatPhase = () => dispatch({ type: "RETREAT_PHASE" })
  const finishRun = () => dispatch({ type: "FINISH_RUN"})
  //const advancePly = () => dispatch({ type: "ADVANCE_PLY"})
  //const retreatPly = () => dispatch({ type: "RETREAT_PLY"})
  const reset = () => dispatch({ type: "RESET" })

  return {
    state,
    start, reset,
    solve, fail,
    next, prev,
    advancePhase, retreatPhase,
    finishRun,
    //advancePly, retreatPly,  
    dispatch, // 必要なら生 dispatch も公開
  }
}
