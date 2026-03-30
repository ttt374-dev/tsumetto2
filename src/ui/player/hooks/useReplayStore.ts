import { create } from "zustand"

type ReplayPhase = "idle" | "animating"

type ReplayStore = {
    ply: number
    maxPly: number
    phase: ReplayPhase

    initialize: (maxPly: number) => void
    reset: () => void
    advancePly: () => void
    retreatPly: () => void
    moveTo: (ply: number) => void    
    startAnimation: () => void
    endAnimation: () => void
}


export const useReplayStore = create<ReplayStore>((set, get) => ({
    ply: 0,
    maxPly: -1,
    phase: "idle",

    initialize: (maxPly: number) => {
        set({ maxPly, ply: 0, phase: "idle" })
    },
    reset: () => {
        set({ ply: 0 })
    },

    moveTo: (ply: number) => {       // 範囲外でもclampして強制的に収める仕様             
        const { maxPly, phase } = get()
        assertInitialized(maxPly)
        ////if (phase !== "idle") return   // ← アニメ中は無効
        set({ ply: clampPly(ply, maxPly) })
    },
    advancePly: () => {
        const { moveTo, ply } = get()
        moveTo(ply + 1)
    },
    retreatPly: () => {
const { moveTo, ply } = get()
        moveTo(ply - 1)
    },
    startAnimation: () => {
        set({ phase: "animating" })
    },

    endAnimation: () => {
        set({ phase: "idle" })
    },    


}))
//////////////
function clampPly(ply: number, max: number) {
    return Math.max(0, Math.min(ply, max))
}
function assertInitialized(maxPly: number) {
    if (maxPly < 0) {
        throw new Error("replay store not initialized")
    }
}