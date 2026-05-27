import type { MissionDatasource } from "@/domain/mission/datasource/MissionDatasource"
import type { Mission, MissionId } from "../entity/Mission"

export class MissionRepository {
    private missions: Mission[] | null = null

    constructor(
        private readonly ds: MissionDatasource
    ) { }

    private async ensureLoaded(): Promise<Mission[]> {
        if (this.missions === null) {
            this.missions = await this.ds.findAll()
        }
        return this.missions
    }

    async findAll(): Promise<Mission[]> {
        return await this.load()
    }
    async replaceAll(missions: Mission[]) {
        await this.write(missions)
    }
    async save(mission: Mission): Promise<void> {
        const prev =  await this.findAll()
        const index =  prev.findIndex(m => m.id === mission.id)

        const next = [...prev]

        if (index === -1) {
            next.push(mission)
        } else {
            next[index] = mission
        }
        await this.replaceAll(next)
    }

    async delete(id: MissionId): Promise<void> {
        const prev = await this.ds.findAll()
        const next = prev.filter(m => m.id !== id)
        
        if (next.length === prev.length) return // no-op
        await this.ds.replaceAll(next)
    }
    ////////////////////////////////////////
    private async load(): Promise<Mission[]> {
        const missions = await this.ensureLoaded()
        return [...missions]
    }
    private async write(missions: Mission[]) {
        this.missions = missions
        //console.log("mission saved", missions)
        await this.ds.replaceAll(missions)
    }

}

/*

export interface MissionPersistence {
    load(): Promise<Mission[]>
    save(missions: Mission[]): Promise<void>
}

const STORAGE_KEY = "study-mission-v1"

export class LocalStorageMissionPersistence implements MissionPersistence {
    async load(): Promise<Mission[]> {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []        
        
        return JSON.parse(raw) as any[]
    }

    async save(missions: Mission[]): Promise<void> {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(missions)
        )
    }
}
*/