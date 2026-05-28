import type { Mission } from "@/domain/mission/entity/Mission"

export interface MissionDatasource {
    findAll(): Promise<Mission[]>
    replaceAll(missions: Mission[]): Promise<void>
}

