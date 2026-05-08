import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore";
import { useSessionStore } from "@/ui/screens/session/store/useSessionStore";
import { useMissionStore } from "@/ui/screens/mission/hooks/useMissionStore";
import { buildSessionPlayerVieModel } from "@/ui/screens/session/vm/buildSessionPlayerViewModel";
import type { SessionPlayerInput } from "@/ui/screens/session/vm/SessionPlayerViewModel";
import { useSessionRouteContext, type SessionRouteContext } from "@/ui/screens/session/hooks/useSessionRouteContext";

export function useSessionPlayerViewModel(route: SessionRouteContext) {

    //const { resParsed } = useSessionRouteContext()

    const ids = useSessionStore(s => s.problemIds)
    const byId = useProblemStore(s => s.byId)
    const activeSessionId = useSessionStore(s=>s.activeSessionId)    
    const missionId = useSessionStore(s => s.missionId)

    const missions = useMissionStore(s => s.missions)
    
    const input: SessionPlayerInput = {
        ...route.result,
        ids, byId, missions, missionId, activeSessionId,
    }

    return buildSessionPlayerVieModel(input)
}