import type { Player } from "@/domain/kif/entity"
import { create } from "zustand"

type GameUIState = {
    isReversed: boolean
    userSide: Player
    isMovesVisible: boolean

    toggleReversed: () => void
    toggleUserSide: () => void
    setReversed: (value: boolean) => void
    setMovesVisible: (value: boolean) => void
}

export const useGameUIStore = create<GameUIState>((set, get) => ({
    isReversed: false,
    userSide: "black",
    isMovesVisible: false,

    toggleReversed: () => {
        set({ isReversed: !get().isReversed })
    },
    toggleUserSide: () => {
        set({ userSide: get().userSide === "black" ? "white" : "black"})
    },

    setReversed: (value) => {
        set({ isReversed: value })
    },
    setMovesVisible: (value) => 
        set({ isMovesVisible: value})
    
}))