import type { Player } from "@/domain/kif/entity"
import { create } from "zustand"

type GameUIState = {
    isReversed: boolean
    userSide: Player
    isMovesVisible: boolean
    boardFlash: boolean

    initialize: () => void
    toggleReversed: () => void
    toggleUserSide: () => void
    setReversed: (value: boolean) => void
    setMovesVisible: (value: boolean) => void
    toggleMovesVisible: () => void    
    flashBoard: (flag: boolean) => void
}

export const useGameUIStore = create<GameUIState>((set, get) => ({
    isReversed: false,
    userSide: "black",
    isMovesVisible: false,
    boardFlash: false,

    initialize: () => {
        set({ isReversed: false, userSide: "black", isMovesVisible: false})
    },
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
        set({ isMovesVisible: value}),
    toggleMovesVisible: () => {
        set({ isMovesVisible: !get().isMovesVisible})
    },
    flashBoard: (flag: boolean) => {
        set({boardFlash: flag})
    }
    
}))