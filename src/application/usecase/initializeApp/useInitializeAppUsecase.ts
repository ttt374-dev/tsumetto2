import { createDefaultMission } from "@/domain/mission/entity/createDefaultMission"
import type { MissionRepository } from "@/domain/mission/repository/MissionRepository"

export async function initializeAppUsecase(
    missionRepository: MissionRepository
): Promise<void> {
    const missions = await missionRepository.findAll()

    if (missions.length === 0) {
        await missionRepository.replaceAll([createDefaultMission()])
    }

    
}