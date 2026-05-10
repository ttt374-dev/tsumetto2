import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore"
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore"

export function useSessionPlayerTitle(index: number, problemTitle: string) {
    const missionId = useSessionStore(s => s.missionId)
    const missions = useMissionStore(s => s.missions)
    const count = useProblemStore(s=>s.ids.length)
    const missionName: string = missions.find(d => d.id === missionId)?.name ?? ""

    return buildSessionPlayerTitle({missionName, index, count, problemTitle})
}

function buildSessionPlayerTitle(props: {
    missionName: string,
    index: number,
    count: number,
    problemTitle: string
}){
    return `[${props.missionName} (${props.index + 1}/${props.count})]: ${props.problemTitle}`   
}