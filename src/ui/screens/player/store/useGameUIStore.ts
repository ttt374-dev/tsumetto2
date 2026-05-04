import type { Player } from "@/domain/kif/entity"
import { create } from "zustand"

type GameUIState = {
    reversed: boolean
    userSide: Player

    toggleReversed: () => void
    toggleUserSide: () => void
    setReversed: (value: boolean) => void
}

export const useGameUIStore = create<GameUIState>((set, get) => ({
    reversed: false,
    userSide: "black",

    toggleReversed: () => {
        set({ reversed: !get().reversed })
    },
    toggleUserSide: () => {
        set({ userSide: get().userSide === "black" ? "white" : "black"})
    },

    setReversed: (value) => {
        set({ reversed: value })
    },
    
}))