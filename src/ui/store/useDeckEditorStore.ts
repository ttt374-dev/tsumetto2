import { create } from "zustand"
import type { Deck } from "@/domain/deck/entity/Deck"
import { createDefaultDeck } from "@/domain/deck/entity/createDefaultDeck"

type DeckEditorState = {
    draft: Deck | null

    startNew: () => void
    startEdit: (deck: Deck) => void

    setName: (name: string) => void
    setSnapshot: (snapshot: Deck["snapshot"]) => void

    reset: () => void
}

export const useDeckEditorStore = create<DeckEditorState>((set) => ({
    draft: null,

    startNew: () =>
        set({
            draft: createDefaultDeck(),
        }),

    startEdit: (deck) =>
        set({
            draft: { ...deck }, // コピー重要
        }),

    setName: (name) =>
        set((state) =>
            state.draft
                ? { draft: { ...state.draft, name } }
                : state
        ),

    setSnapshot: (snapshot) =>
        set((state) =>
            state.draft
                ? { draft: { ...state.draft, snapshot } }
                : state
        ),

    reset: () => set({ draft: null }),
}))
