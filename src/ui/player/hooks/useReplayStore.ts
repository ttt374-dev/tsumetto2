import { create } from "zustand"

type ReplayStore = {
    ply: number
    maxPly: number

    initialize: (maxPly: number) => void
    reset: () => void
    advancePly: () => void
    moveTo: (ply: number) => void
    advanceTurn: () => void
    applyOpponentMove: () => void
}

export const useReplayStore = create<ReplayStore>((set, get) => ({
    ply: 0,
    maxPly: -1,

    initialize: (maxPly: number) => {
        set({ maxPly })
    },
    reset: () => {
        set({ ply: 0 })
    },

    moveTo: (ply: number) => {       // 範囲外でもclampして強制的に収める仕様             
        //if (ply < 0 || ply > max) return
        //alert(ply)
        if (ply < 0) throw new Error("replay store not initialized")
        set({ ply: clampPly(ply, get().maxPly) })
    },
    advancePly: () => {
        const { moveTo, ply } = get()
        moveTo(ply + 1)
    },
    advanceTurn: () => {
        get().advancePly()
        get().applyOpponentMove()
    },

    applyOpponentMove: () => {
        // TOOD
        setTimeout(() => {
            set(s => {
                const nextPly = clampPly(s.ply + 1, get().maxPly)
                return { ply: nextPly }
            })
        }, 500)

    },

}))
//////////////
function clampPly(ply: number, max: number) {
    return Math.max(0, Math.min(ply, max))
}