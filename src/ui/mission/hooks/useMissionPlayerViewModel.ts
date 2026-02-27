import { useDeckStore } from "@/ui/store/useDeckStore"
import { useMissionStore } from "@/ui/store/useMissionStore"
import { useProblemStore } from "@/ui/store/useProblemStore"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import type { ProblemNavigation } from "@/ui/player/PlayerScreen"
import React, { useCallback, useMemo } from "react"
import type { SolvedResult } from '@/domain/learning/entity/Learning';
import { useLearningEventStore } from '@/ui/store/useLearningEventStore';

type MissionPlayerVM =
  | { status: "idle" }
  | { status: "finished" }
  | { status: "loading"}
  | { status: "missing"}
  | {
      status: "playing"
      problem: Problem
      title: string
      problemNavigation: ProblemNavigation
      index: number
      count: number
      answer: (problemId: ProblemId, res: SolvedResult, sec?: number) => void
      undoLastAnswer: () => void
    }

/////////////////////
export function useMissionPlayerViewModel(): MissionPlayerVM {
    const problemIds = useMissionStore(s => s.problemIds)
    const learningEvents = useLearningEventStore(s=>s.eventLog)
    const index = useMissionStore(s => s.currentIndex)
    const deckId = useMissionStore(s => s.deckId)

    const answerMission = useMissionStore(s => s.answer)
    const missionId = useMissionStore(s=>s.missionId)
    const next = useMissionStore(s => s.next)
    const prev = useMissionStore(s => s.prev)
    const moveTo = useMissionStore(s => s.moveToId)

    const currentProblemId = problemIds[index]
    const count = problemIds.length
    
    const problem = useProblemStore(s => s.byId[currentProblemId])
    const review = useLearningEventStore(s=>s.recordReview)
    const cancel = useLearningEventStore(s=>s.recordCancel)    

    // deckName
    const deckName = useDeckStore(
        s => deckId ? s.decks.find(d => d.id === deckId)?.name ?? "" : ""
    )

    // navigation
    const problemNavigation = useMemo(() => ({ next, prev, moveTo }), [next, prev, moveTo])

    const answer = useCallback(
        (problemId: ProblemId, res: SolvedResult, sec?: number | undefined) => {
            if (!missionId) return
            //console.log("answer", problemId)
            review(problemId, missionId, res, sec)
            answerMission(res, sec)
            next()
        },
        [answerMission, next]
    )
    const undoLastAnswer = () => {
        if (!missionId) return
        const last = [...learningEvents].reverse().find(e=>e.type === "reviewed" && e.missionId === missionId)
        if (!last) return
        cancel(missionId, last.id)        
        console.log("undo last", last)
        prev()
    }

    if (count === 0) {
        return { status: "idle" }
    }

    if (index < 0 || index >= count) {
        return { status: "finished" }
    }

    if (!currentProblemId) {
        return { status: "finished" }
    }
    
    if (!problem) {
        //if (loading) return { status: "loading" }
        return { status: "loading"} // TODO
        
    }

    const title = `[${deckName} (${index + 1}/${count})]: ${problem.title}`       


    return { 
        status: "playing",
        problem, title,  problemNavigation, index, count, answer,
        undoLastAnswer,
     }
}


