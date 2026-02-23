import type { ReactNode } from 'react';
import { useDeckStore } from "@/ui/store/useDeckStore"
import { useMissionStore } from "@/ui/store/useMissionStore"
import { useProblemStore } from "@/ui/store/useProblemStore"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import type { ProblemNavigation } from "@/ui/player/PlayerScreen"
import React, { useCallback, useMemo, type ReactHTMLElement } from "react"
import type { SolvedResult } from '@/domain/learning/entity/Learning';

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
      handleAnswer: (id: ProblemId, res: SolvedResult, sec?: number) => void
    }

/////////////////////
export function useMissionPlayerViewModel(): MissionPlayerVM {
    const problemIds = useMissionStore(s => s.problemIds)
    const index = useMissionStore(s => s.currentIndex)
    const deckId = useMissionStore(s => s.deckId)

    const answer = useMissionStore(s => s.answer)
    const next = useMissionStore(s => s.next)
    const prev = useMissionStore(s => s.prev)
    const moveTo = useMissionStore(s => s.moveToId)

    const currentProblemId = problemIds[index]
    const count = problemIds.length

    // Invalid state チェック
    console.log("misionplayervm ", index, currentProblemId)

    // problem
    
    const problem = useProblemStore(s => s.byId[currentProblemId])
    //if (!problem) return undefined

    // deckName
    const deckName = useDeckStore(
        s => deckId ? s.decks.find(d => d.id === deckId)?.name ?? "" : ""
    )

    // navigation
    const problemNavigation = useMemo(() => ({ next, prev, moveTo }), [next, prev, moveTo])

    const handleAnswer = useCallback(
        (_id: string, res: SolvedResult, _sec?: number) => {
            answer(res)
            next()
        },
        [answer, next]
    )

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
        problem, title,  problemNavigation, index, count, handleAnswer
     }
}


