import { create } from "zustand"

type GameUIState = {
    reversed: boolean

    toggleReversed: () => void
    setReversed: (value: boolean) => void
}

export const useGameUIStore = create<GameUIState>((set, get) => ({
    reversed: false,

    toggleReversed: () => {
        set({ reversed: !get().reversed })
    },

    setReversed: (value) => {
        set({ reversed: value })
    },
}))