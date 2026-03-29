import { useMissionStore } from "@/ui/mission/hooks/useMissionStore"
import { useSessionStore } from "@/ui/session/hooks/useSessionStore"
import { useProblemStore } from "@/ui/store/useProblemStore"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import type { SolvedResult } from "@/domain/review/solvedResult"
import { useReviewEventStore } from '@/ui/store/useReviewEventStore';
import type { SessionId } from "@/domain/session/entity/Session";
import type { ReviewAction } from "@/domain/review/ReviewEvent";
import { useEffect, useState } from "react"
import { v4 } from "uuid"

export type SessionPlayerVM =
  | { status: "idle" }
  | { status: "finished" }
  | { status: "loading"}
  | { status: "missing"}
  | SessionPlayerPlayingVM
  
export type SessionPlayerPlayingVM = {
      status: "playing"
      problem: Problem
      title: string      
      index: number
      count: number
      problemIds: ProblemId[]
      sessionId: SessionId
      results: Record<ProblemId, SolvedResult>
      nextProblem: () => void
      moveToProblemId: (id: ProblemId) => void
      submitSolvedResult: (res: SolvedResult, actions: ReviewAction[]) => boolean
      //undoLastAnswer: () => void
      //hasLastAnswer: () => boolean
      navigateToSummary: () => void
    }

/////////////////////
export function useSessionPlayerViewModel(): SessionPlayerVM {
    const problemIds = useSessionStore(s => s.problemIds)
    const index = useSessionStore(s => s.currentIndex)
    const missionId = useSessionStore(s => s.missionId)
    const sessionId = useSessionStore(s=>s.sessionId)
    const next = useSessionStore(s => s.next)
    //const prev = useSessionStore(s => s.prev)
    const moveToProblemId = useSessionStore(s=>s.moveToId)
    const results = useSessionStore(s=>s.results)
    const submitResult = useSessionStore(s=>s.submitResult)
    const summary = useSessionStore(s=>s.summary)

    const currentProblemId = problemIds[index]
    const count = problemIds.length
    
    const problem = useProblemStore(s => s.byId[currentProblemId])

    // learning event log
    //const getLastEvent = useReviewEventStore(s=>s.getLastReviewedEvent)
    const appendReview = useReviewEventStore(s=>s.appendReview)
    //const cancel = useReviewEventStore(s=>s.appendCancel)    

    // missionName
    const missionName = useMissionStore(
        s => missionId ? s.missions.find(d => d.id === missionId)?.name ?? "" : ""
    )

    // navigation
    const submitSolvedResult = (res: SolvedResult, actions: ReviewAction[]) => { // submit したら true を返す        
        if (!sessionId) return false
        //console.log("submit answer", results)
        if (results[currentProblemId]) {
            //console.log("alread submitted", currentProblemId, res, actions)
            return false// allready submitted
        }
        submitResult(currentProblemId, res)
        const reviewId = v4()
        appendReview(currentProblemId, reviewId, sessionId, res, actions)
        return true        
    }    

    /*
    const undoLastAnswer = () => {
        if (!sessionId) return
        const last = getLastEvent(sessionId)
        if (!last) return       
        
        submitResult(last.problemId, undefined)
        cancel(last.id, sessionId) 
        console.log("cancel", last.id, results)       
        prev()
    }
    ///////////////////////////////////////////////
    const hasLastAnswer = (): boolean => {
        return sessionId && getLastEvent(sessionId) ? true : false
    }*/
    
    if (count === 0) {
        return { status: "idle" }
    }

    if (index >= count || !currentProblemId) {
        return { status: "finished" }
    }
    
    if (!problem) {
        return { status: "loading"} // TODO        
    }
    if (!sessionId) {
        return { status: "idle"} // TODO: idle ?? or errro
    }   
    
    
    const title = `[${missionName} (${index + 1}/${count})]: ${problem.title}`     
    
    return { 
        status: "playing", 
        problemIds, sessionId, results, problem, title, index, count, 
        nextProblem: next, moveToProblemId, submitSolvedResult, //undoLastAnswer, hasLastAnswer,
        navigateToSummary: summary
     }
}


