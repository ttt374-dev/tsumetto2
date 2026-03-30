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
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import { useGameStore, type GameEvent } from "@/ui/player/hooks/useGameStore"
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext"

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
      //results: Record<ProblemId, SolvedResult>
      nextProblem: () => void
      moveTo: (index: number) => void
      submitSolvedResult: () => boolean
      //undoLastAnswer: () => void
      //hasLastAnswer: () => boolean
      navigateToSummary: () => void
      flush: () => void
    }

/////////////////////
export function useSessionPlayerViewModel(): SessionPlayerVM {   

    const problemIds = useSessionStore(s => s.problemIds)
    const index = useSessionStore(s => s.currentIndex)
    const missionId = useSessionStore(s => s.missionId)
    const sessionId = useSessionStore(s=>s.sessionId)
    const next = useSessionStore(s => s.next)
    //const prev = useSessionStore(s => s.prev)
    const moveTo = useSessionStore(s=>s.moveTo)
    //const results = useSessionStore(s=>s.results)
    //const submitResult = useSessionStore(s=>s.submitResult)
    const summary = useSessionStore(s=>s.summary)
    const { events, dispatch, state } = useGameStore()

    const currentProblemId = problemIds[index]
    const count = problemIds.length
    
    const problem = useProblemStore(s => s.byId[currentProblemId])
    const appendReview = useReviewEventStore(s=>s.appendReview)

    // missionName
    const missionName = useMissionStore(
        s => missionId ? s.missions.find(d => d.id === missionId)?.name ?? "" : ""
    )
    //const hasSubmitted: Record<ProblemId, boolean> = {}
    const [submittedIds, setSubmittedIds] = useState<Set<ProblemId>>(new Set())

    useEffect(()=>{
        setSubmittedIds(new Set())
    }, [sessionId])

    useEffect(()=>{ 
        //setHasSubmitted(false)

        return () => {
            flush()
        }
    }, [currentProblemId])

    // navigation
    const submitSolvedResult = () => { // submit したら true を返す               
        if (!sessionId) return false
        //if (solvedResultRecords[currentProblemId]) return false
        if (submittedIds.has(currentProblemId)) return false

        //alert("sub res")
        
        /*
        if (results[currentProblemId]) {
            //console.log("alread submitted", currentProblemId, res, actions)
            return false// allready submitted
        }*/
            const res = deriveSolvedResultFromEvents(events) //deriveSolvedResult(state, timer.elapsedSec)
        //const actions = toReviewActions(events)
                
        //submitResult(currentProblemId, res)
        const reviewId = v4()
        appendReview(currentProblemId, reviewId, sessionId, res)
        console.log("submit answer", res)
        //setHasSubmitted(true)
        //solvedResultRecords[currentProblemId] = res
        submittedIds.add(currentProblemId)
        return true        
    }    
    const flush = () => {
        if (submittedIds.has(currentProblemId)) return  // サブミット済なら何もしない        

        if (!state.isSolved && (state.isRevealed || state.mistakes > 0)) { // もし解かれてなかった、答えを見た、間違えてたら、諦めたと見なす
            const { ply, elapsedSec } = createPlayerContext()
            alert("abandon")
            dispatch({ type: "ABANDON", ply, elapsedSec })
            submitSolvedResult()
        }
        
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
        problemIds, sessionId, problem, title, index, count, 
        nextProblem: next, moveTo, submitSolvedResult, //undoLastAnswer, hasLastAnswer,
        navigateToSummary: summary, flush,
     }
}

/*

////////////////
function toReviewActions(events: GameEvent[]): ReviewAction[] {
    return events.flatMap((e): ReviewAction[] => {
        switch (e.type) {
            case "MISTAKE":
                return [{ type: "mistake", ply: e.ply, elapsedSec: e.elapsedSec }]
            case "REVEAL":
                return [{ type: "reveal", ply: e.ply, elapsedSec: e.elapsedSec }]
            case "ABANDON":
                return [{ type: "abandon", ply: e.ply, elapsedSec: e.elapsedSec }]
            default:
                return []
        }
    })
}*/