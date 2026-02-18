import { create } from "zustand"
import { v4 } from "uuid"
import { DefaultFilterState } from "@/domain/problem/query/filter"
import { DefaultSortState } from "@/domain/problem/query/sort"
import type { Deck } from "@/domain/deck/Deck"

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
            draft: {
                id: v4(),
                name: "",
                snapshot: {
                    filterState: DefaultFilterState,
                    sortState: DefaultSortState,
                },
                createdAt: Date.now(),
            },
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
