import { useMissionStore } from "@/application/store/useMissionStore"
import { useProblemStore } from "@/application/store/useProblemStore"
import type { Problem } from "@/domain/problem/Problem"
import { PlayerScreen } from "../player/PlayerScreen"


export function MissionPlayerScreen() {        
    const currentProblemId = useMissionStore(s=>s.snapshot.currentProblemId)
    const index = useMissionStore(s=>s.index())
    const count = useMissionStore(s=>s.count())
    const missionAnswer = useMissionStore(s=>s.answer)
    const problem: Problem | undefined = useProblemStore(s=>
        currentProblemId !== undefined ? s.byId[currentProblemId] : undefined)
    const navigationHandlers = {
        next: useMissionStore(s=>s.next),
        prev: useMissionStore(s=>s.prev),
        moveTo: useMissionStore(s=>s.moveTo),
    }
    console.log("playscree", currentProblemId)
    
    if (!problem) return (<>Loading...</>)

    const title = formatTitle(problem.title, index, count)
    return (
        <PlayerScreen problem={problem}
            title={title}
            onAnswer={(id, res, sec) => {
                missionAnswer(res)
                navigationHandlers.next()
            }}
            navigationHandlers={navigationHandlers}            
        />
    )
}
const formatTitle = (rawTitle: string, index: number, length: number): string => {
    const titlePrefix = `${(index ?? 0) + 1}/${length}: `
    const title = `${titlePrefix}${rawTitle}`
    return title
}
