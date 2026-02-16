import { useMissionStore } from "@/application/store/useMissionStore"
import { useProblemStore } from "@/application/store/useProblemStore"
import type { Problem } from "@/domain/problem/Problem"
import { PlayerScreen } from "../player/PlayerScreen"
import { useDeckStore } from "@/application/store/useDeckStore"
import { useCallback, useMemo } from "react"
import type { SolvedResult } from "@/domain/learning/Learning"

export function useMissionPlayerViewModel() {
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
    const navigationHandlers = useMemo(() => ({ next, prev, moveTo }), [next, prev, moveTo])

    const handleAnswer = useCallback(
        (_id: string, res: SolvedResult, _sec?: number) => {
            answer(res)
            next()
        },
        [answer, next]
    )

    if (!problem || index < 0 || index >= count || !currentProblemId) {
        return undefined
    }

    const title = `[${deckName} (${index + 1}/${count})]: ${problem.title}`

    return { problem, title, navigationHandlers, index, count, handleAnswer }
}
////////////////////////////////////////////////
export function MissionPlayerScreen() {
    
    const vm = useMissionPlayerViewModel()
    console.log("missionplayer", vm)
    if (!vm) return (<>Loading...</>)
    
    return (
        <PlayerScreen problem={vm.problem}
            title={vm.title}
            onAnswer={vm.handleAnswer}
            navigationHandlers={vm.navigationHandlers}            
        />
    )
}
