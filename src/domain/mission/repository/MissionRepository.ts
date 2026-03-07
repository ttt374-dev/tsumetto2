import type { Mission, MissionId } from "../entity/Mission"

export class MissionRepository {
    private missions: Mission[] | null = null

    constructor(
        private readonly persistence: MissionPersistence
    ) { }

    private async ensureLoaded(): Promise<Mission[]> {
        if (this.missions === null) {
            this.missions = await this.persistence.load()
        }
        return this.missions
    }

    async findAll(): Promise<Mission[]> {
        return await this.load()
    }
    async replaceAll(missions: Mission[]) {
        await this.save(missions)
    }
    private async load(): Promise<Mission[]> {
        const missions = await this.ensureLoaded()
        return [...missions]
    }
    private async save(missions: Mission[]) {
        this.missions = missions
        console.log("mission saved", missions)
        await this.persistence.save(missions)
    }


}

export interface MissionPersistence {
    load(): Promise<Mission[]>
    save(missions: Mission[]): Promise<void>
}

const STORAGE_KEY = "study-mission-v1"

export class LocalStorageMissionPersistence implements MissionPersistence {
    async load(): Promise<Mission[]> {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []

        
        const data = JSON.parse(raw) as any[]
        //console.log("load raw", raw, data)
        return data
    }

    async save(missions: Mission[]): Promise<void> {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(missions)
        )
    }
}
