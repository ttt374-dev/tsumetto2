import { create } from "zustand"
import type { Deck, DeckId } from "@/domain/deck/Deck"
import type { DeckRepository } from "@/domain/deck/repository/DeckRepository"

let repository: DeckRepository

export const initDeckStore = (repo: DeckRepository) => {
    repository = repo
}

type DeckStoreState = {
    decks: Deck[]
    loadDecks: () => Promise<void>
    saveDeck: (deck: Deck) => Promise<void>
    deleteDeck: (id: DeckId) => Promise<void>
    replaceAll: (decks: Deck[]) => Promise<void>
}

export const useDeckStore = create<DeckStoreState>((set, get) => ({
    decks: [],

    loadDecks: async () => {
        const list = await repository.load()
        set({ decks: list })
    },

    saveDeck: async (deck: Deck) => {
        console.log("save deck", deck)
        await repository.update(deck)
        await get().loadDecks()
    },

    deleteDeck: async (id: DeckId) => {
        await repository.remove(id)
        await get().loadDecks()
    },
    replaceAll: async (newDecks: Deck[]) => {
        // repository 側でまとめて保存
        await repository.replaceAll(newDecks)
        set({ decks: newDecks })
    }

}))
