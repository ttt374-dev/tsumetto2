import type { Mission, MissionId,} from "@/domain/mission/entity/Mission"
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useMissionStore } from "./useMissionStore"

export function useMissionMutation() {
    const repos = useRepositoryContext()
    const missions = useMissionStore(s => s.missions)

    const replaceAll = useMissionStore(s => s.replaceAll)
    const patchMissionLocal = useMissionStore(s => s.patchMission)    
    const removeMissionLocal = useMissionStore(s => s.removeMission)
    

    /////////////////////////
    // save

    const saveMission = async (mission: Mission) => {
        const prev = missions

        // optimistic update
        patchMissionLocal(mission)

        try {
            await repos.mission.save(mission)
        } catch (e) {
            replaceAll(prev)
            throw e
        }
    }


    /////////////////////////
    // delete

    const deleteMission = async (id: MissionId) => {
        const prev = missions

        // optimistic update
        removeMissionLocal(id)

        try {
            await repos.mission.delete(id)

        } catch (e) {
            replaceAll(prev)
            throw e
        }
    }

    
    /////////////////////////
    // replace all

    const replaceAllMissions = async (next: Mission[]) => {
        const prev = missions

        // optimistic update
        replaceAll(next)

        try {
            await repos.mission.replaceAll(next)
        } catch (e) {

            replaceAll(prev)

            throw e
        }
    }

    return {
        saveMission,
        deleteMission,
        replaceAll: replaceAllMissions,
    }
}