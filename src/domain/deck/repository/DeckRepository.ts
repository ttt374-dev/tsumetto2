import type { Deck, DeckId } from "./Deck"

// domain/deck/DeckRepository.ts
/*
export interface DeckRepository {
  list(): Promise<Deck[]>
  get(id: DeckId): Promise<Deck | undefined>
  save(deck: Deck): Promise<void>
  delete(id: DeckId): Promise<void>
}
  */
// infra/deck/DeckRepositoryImpl.ts

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

  async load(): Promise<Deck[]> {
    const decks = await this.ensureLoaded()
    return [...decks]
  }
  private async save(decks: Deck[]) {
    await this.persistence.save(decks)
  }

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
  async replaceAll(decks: Deck[]) {
    await this.save(decks)
  }
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
    return data
  }

  async save(decks: Deck[]): Promise<void> {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(decks)
    )
  }
}
