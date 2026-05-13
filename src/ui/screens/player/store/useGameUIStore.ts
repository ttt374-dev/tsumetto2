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
    setUserSide: (player: Player) => void
    setReversed: (value: boolean) => void
    setMovesVisible: (value: boolean) => void
    toggleMovesVisible: () => void    
    flashBoard: (flag: boolean) => void
    
}
const BoardFlashMs = 100

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
    setUserSide: (user: Player) => {
        set({userSide: user})
    },
    setReversed: (value) => {
        set({ isReversed: value })
    },
    setMovesVisible: (value) => 
        set({ isMovesVisible: value}),
    toggleMovesVisible: () => {
        set({ isMovesVisible: !get().isMovesVisible})
    },
    flashBoard: (flag) => {
        set({
            boardFlash: flag
        })

        setTimeout(() => {
            if (get().boardFlash === true) {
                set({
                    boardFlash: false
                })
            }
        }, BoardFlashMs)
    }
    
}))