import type { Mission, MissionId } from "../entity/Mission"

export class MissionRepository {
    private decks: Mission[] | null = null

    constructor(
        private readonly persistence: MissionPersistence
    ) { }

    private async ensureLoaded(): Promise<Mission[]> {
        if (this.decks === null) {
            this.decks = await this.persistence.load()
        }
        return this.decks
    }

    async findAll(): Promise<Mission[]> {
        return await this.load()
    }
    async replaceAll(decks: Mission[]) {
        await this.save(decks)
    }
    private async load(): Promise<Mission[]> {
        const decks = await this.ensureLoaded()
        return [...decks]
    }
    private async save(decks: Mission[]) {
        this.decks = decks
        console.log("deck saved", decks)
        await this.persistence.save(decks)
    }


}

export interface MissionPersistence {
    load(): Promise<Mission[]>
    save(decks: Mission[]): Promise<void>
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

    async save(decks: Mission[]): Promise<void> {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(decks)
        )
    }
}
