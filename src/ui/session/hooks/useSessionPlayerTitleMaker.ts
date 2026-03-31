import type { MissionId } from "@/domain/mission/entity/Mission"
import type { Problem } from "@/domain/problem/entity/Problem"
import { useMissionStore } from "@/ui/mission/hooks/useMissionStore"
import { useSessionStore } from "@/ui/session/hooks/useSessionStore"

export function useSessionPlayerTitleMaker(problem: Problem){
    const missionId = useSessionStore(s => s.missionId)
    const index = useSessionStore(s => s.currentIndex)
    const missionName = useMissionStore(
        s => missionId ? s.missions.find(d => d.id === missionId)?.name ?? "" : ""
        )
    const problemIds = useSessionStore(s => s.problemIds)
    const count = problemIds.length
    const title = `[${missionName} (${index + 1}/${count})]: ${problem.title}`   
    
    return { title }
}
