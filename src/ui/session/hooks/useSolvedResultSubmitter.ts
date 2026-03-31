import type { Problem } from "@/domain/problem/entity/Problem"
import { deriveSolvedResultFromEvents } from "@/domain/review/service/solvedResultDeriver"
import type { SolvedResult } from "@/domain/review/solvedResult"
import type { SessionId } from "@/domain/session/entity/Session"
import { createPlayerContext } from "@/ui/player/components/types/PlayerContext"
import { useGameStore, type GameEvent } from "@/ui/player/store/useGameStore"
import { useReviewEventStore } from "@/ui/store/useReviewEventStore"
import { useMemo } from "react"
import { v4 } from "uuid"

export function useSolvedResultSubmitter(problem: Problem, sessionId: SessionId){
    const { events, dispatch, state } = useGameStore()
    const appendReview = useReviewEventStore(s=>s.appendReview)    
    const reviewedEvents = useReviewEventStore(s=>s.eventLog)

    const hasSubmitted = useMemo(() =>
        reviewedEvents.some(
            e => e.type === "reviewed"
                && e.problemId === problem.id
                && e.sessionId === sessionId
        ),
        [problem.id, sessionId, reviewedEvents])

    // navigation
    const submitSolvedResult = async (result?: SolvedResult) => {
        if (hasSubmitted) return

        const res = result ?? deriveSolvedResultFromEvents(events) //deriveSolvedResult(state, timer.elapsedSec)
        const reviewId = v4()
        await appendReview(problem.id, reviewId, sessionId, res)
        console.log("submit answer", res)        
    }    
    const flush = async () => {
        if (hasSubmitted) return    // サブミット済なら何もしない        

        if (shouldAbandon()){
            dispatch(createAbandonEvent())
            await submitSolvedResult()
        }        
    }
    const shouldAbandon = () =>
        !state.isSolved && (state.isRevealed || state.mistakes > 0)

    const createAbandonEvent = (): GameEvent => {
        const { ply, elapsedSec } = createPlayerContext()
        return { type: "ABANDON", ply, elapsedSec }
    }
    return { submitSolvedResult, flush }
}

