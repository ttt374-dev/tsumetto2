import { useMissionEventStoreContext } from "@/ui/App/providers/MissionEventStoreProvider"
import type { ProblemId } from "../problem/Problem"

export function useMissionCoordinator(){
    const missionEventStore = useMissionEventStoreContext()    

    const startMission = (ids: ProblemId[]) => {
        missionEventStore.start(ids)
    }
    return { startMission }
}