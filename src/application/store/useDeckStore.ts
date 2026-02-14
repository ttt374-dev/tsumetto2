import { create } from "zustand"
import type { Deck, DeckId } from "@/domain/deck/Deck"
import type { DeckRepository } from "@/domain/deck/DeckRepository"

let repository: DeckRepository

export const initDeckStore = (repo: DeckRepository) => {
    repository = repo
}

type DeckStoreState = {
    decks: Deck[]
    loadDecks: () => Promise<void>
    saveDeck: (deck: Deck) => Promise<void>
    deleteDeck: (id: DeckId) => Promise<void>
    //setRepository: (repo: DeckRepository) => void
}

export const useDeckStore = create<DeckStoreState>((set, get) => ({
    decks: [],



    loadDecks: async () => {
        const list = await repository.load()
        set({ decks: list })
    },

    saveDeck: async (deck: Deck) => {
        await repository.update(deck)
        await get().loadDecks()
    },

    deleteDeck: async (id: DeckId) => {
        await repository.remove(id)
        await get().loadDecks()
    },
}))
