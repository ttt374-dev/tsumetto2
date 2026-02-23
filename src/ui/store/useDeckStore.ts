import { create } from "zustand"

import type { DeckRepository } from "@/domain/deck/repository/DeckRepository"
import type { Deck, DeckId } from "@/domain/deck/entity/Deck"

//let repository: DeckRepository
type DeckStoreState = {
    repo?: DeckRepository
    setRepository: (repo: DeckRepository) => void
    decks: Deck[]
    loadDecks: () => Promise<void>
    saveDeck: (deck: Deck) => void
    deleteDeck: (id: DeckId) => void
    replaceAll: (decks: Deck[]) => void
}

export const useDeckStore = create<DeckStoreState>((set, get) => ({
    repo: undefined,
    setRepository: (repo) => set({ repo }),
    decks: [],
    loadDecks: async () => {
        const repo = get().repo
        if (!repo) throw new Error("Repository not initialized")

        const list = await repo.findAll()
        set({ decks: list })
    },

    saveDeck: async (deck: Deck) => {
        set(state => {
            const index = state.decks.findIndex(d => d.id === deck.id)
            const newDecks = [...state.decks]
            if (index >= 0) {
                newDecks[index] = deck
            } else {
                newDecks.push(deck)
            }
            return { decks: newDecks }
        })
//console.log("save deck", deck)
//await repository.update(deck)
//await get().loadDecks()
    },


    deleteDeck: (id: DeckId) => {
        set(state => ({ decks: state.decks.filter(d => d.id !== id) }))
    },

    replaceAll: (decks: Deck[]) => {
        set({ decks })
    },
}))

/*
/////////////////////////////////////////////////////////
export const initDeckStore = (repo: DeckRepository) => {
    repository = repo

    const saveRepo = debounce(async (decks: Deck[]) => {
        try {
            await repository.replaceAll(decks)
        } catch (e) {
            console.error("Failed to save decks", e)
        }
    }, 1000) // 1秒ごとにまとめて書き出し
    let isInitializing = true
    useDeckStore.subscribe(state => {
        saveRepo(state.decks)
    })
    // 初期ロード完了後にフラグを解除
    isInitializing = false
}
*/