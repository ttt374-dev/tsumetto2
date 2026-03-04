import type { Deck, DeckId } from "../entity/Deck"

export class DeckRepository {
    private decks: Deck[] | null = null

    constructor(
        private readonly persistence: DeckPersistence
    ) { }

    private async ensureLoaded(): Promise<Deck[]> {
        if (this.decks === null) {
            this.decks = await this.persistence.load()
        }
        return this.decks
    }

    async findAll(): Promise<Deck[]> {
        return await this.load()
    }
    async replaceAll(decks: Deck[]) {
        await this.save(decks)
    }
    private async load(): Promise<Deck[]> {
        const decks = await this.ensureLoaded()
        return [...decks]
    }
    private async save(decks: Deck[]) {
        this.decks = decks
        console.log("deck saved", decks)
        await this.persistence.save(decks)
    }
    /*
    async get(id: DeckId): Promise<Deck | undefined> {
        const decks = await this.ensureLoaded()
        return decks.find(d => d.id === id)
    }

    async update(deck: Deck): Promise<void> {
        const decks = await this.ensureLoaded()
        const index = decks.findIndex(d => d.id === deck.id)

        if (index >= 0) {
            decks[index] = deck
        } else {
            decks.push(deck)
        }

        await this.persistence.save(decks)
    }

    async remove(id: DeckId): Promise<void> {
        const decks = await this.ensureLoaded()
        const next = decks.filter(d => d.id !== id)

        if (next.length !== decks.length) {
            this.decks = next
            await this.save(next)
        }
    }
        */

}
// infra/deck/DeckPersistence.ts
export interface DeckPersistence {
    load(): Promise<Deck[]>
    save(decks: Deck[]): Promise<void>
}

// infra/deck/LocalStorageDeckPersistence.ts

const STORAGE_KEY = "study-decks-v1"

export class LocalStorageDeckPersistence implements DeckPersistence {
    async load(): Promise<Deck[]> {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []

        
        const data = JSON.parse(raw) as any[]
        console.log("load raw", raw, data)
        return data
    }

    async save(decks: Deck[]): Promise<void> {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(decks)
        )
    }
}
