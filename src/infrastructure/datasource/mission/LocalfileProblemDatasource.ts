import type { MissionDatasource } from "@/domain/mission/datasource/MissionDatasource"
import type { Mission } from "@/domain/mission/entity/Mission"

const STORAGE_KEY = "study-mission-v1"

export class LocalfileMissionDatasource implements MissionDatasource {
    async findAll() {
        return this.read()
    }
    async replaceAll(missions: Mission[]){
        return this.write(missions)
    }
    //////////////
    // TODO try-catch
    private async read(): Promise<Mission[]> {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []

        return JSON.parse(raw) as any[]
    }

    private async write(missions: Mission[]): Promise<void> {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(missions)
        )
    }
}