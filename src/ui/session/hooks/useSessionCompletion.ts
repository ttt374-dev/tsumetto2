import { useMemo } from "react"
import { v4 } from "uuid"

import type { Problem } from "@/domain/problem/entity/Problem"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"
import type { SessionId } from "@/domain/session/entity/Session"
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext"
import { useGameStore, type GameEvent } from "@/ui/player/store/useGameStore"
import { useReviewEventStore } from "@/ui/store/useReviewEventStore"
import { useSessionStore } from "@/ui/session/hooks/useSessionStore"

export function useSessionCompletion(problem: Problem, sessionId: SessionId){
    const { events, dispatch, state } = useGameStore()
    const appendReview = useReviewEventStore(s=>s.appendReview)    
    const reviewedEvents = useReviewEventStore(s=>s.eventLog)
    const next = useSessionStore(s=>s.next)

    const hasSubmitted = useMemo(() =>
        reviewedEvents.some(
            e => e.type === "reviewed"
                && e.problemId === problem.id
                && e.sessionId === sessionId
        ),
        [problem.id, sessionId, reviewedEvents])

    // navigation
    const submitSolvedResult = (result: SolvedResult) => {
        if (hasSubmitted) return

        //const res = result ?? deriveSolvedResultFromEvents(events) //deriveSolvedResult(state, timer.elapsedSec)
        const reviewId = v4()
        appendReview(problem.id, reviewId, sessionId, result)         
    }    
    const flush = () => {
        if (hasSubmitted) return    // サブミット済なら何もしない        

        if (shouldAbandon()){
            const nextEvents = dispatch(createAbandonEvent())
            const res = deriveSolvedResultFromEvents(nextEvents)
            submitSolvedResult(res)            
        }        
    }
    const solve = () => {
        const res = deriveSolvedResultFromEvents(events)
        submitSolvedResult(res)
    }
    const goNext = () => {
        flush()
        next()
    }
    const skip = () => {
        next()
    }
    //////////////
    // helpers
    const shouldAbandon = () =>
        !state.isSolved && (state.isRevealed || state.mistakes > 0)

    const createAbandonEvent = (): GameEvent => {
        const { ply, elapsedSec } = createPlayerContext()
        return { type: "ABANDON", ply, elapsedSec }
    }        
    
    return { submitSolvedResult, solve, goNext, skip }
}

