import { useDeckStore } from "@/application/store/useDeckStore"
import { useMissionStore } from "@/application/store/useMissionStore"
import { useProblemStore } from "@/application/store/useProblemStore"
import type { SolvedResult } from "@/domain/learning/Learning"
import type { Problem, ProblemId } from "@/domain/problem/Problem"
import type { PlayerViewNavigationHandlers } from "@/ui/player/components/PlayerView"
import { useCallback, useMemo } from "react"

type MissionPlayerVM =
  | { status: "idle" }
  | { status: "finished" }
  | { status: "loading" }
  | { status: "missing", problemId: ProblemId }
  | {
      status: "playing"
      problem: Problem
      title: string
      navigationHandlers: PlayerViewNavigationHandlers
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
    const hydrated = useProblemStore(s=>s.hydrated)
    const loading = useProblemStore(s=>s.loading)

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
    const navigationHandlers = useMemo(() => ({ next, prev, moveTo }), [next, prev, moveTo])

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
        if (loading) return { status: "loading" }
        if (hydrated) return { status: "missing", problemId: currentProblemId}
    }

    const title = `[${deckName} (${index + 1}/${count})]: ${problem.title}`

    return { 
        status: "playing",
        problem, title, navigationHandlers, index, count, handleAnswer }
}