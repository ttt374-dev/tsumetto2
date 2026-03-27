import { create } from "zustand"


type ReplayStore = {
    ply: number
    maxPly: number

    initialize: (maxPly: number) => void
    reset: () => void
    advancePly: () => void
    retreatPly: () => void    
    moveTo: (ply: number) => void
    applyOpponentMove: () => void
}

export const useReplayStore = create<ReplayStore>((set, get) => ({
    ply: 0,
    maxPly: 0,

    initialize: (maxPly: number) => {
        set({maxPly})
    },
    reset: () => {
        set({ply: 0})
    },

    moveTo: (ply: number) => {       // 範囲外でもclampして強制的に収める仕様             
        //if (ply < 0 || ply > max) return
        set({ply: clampPly(ply, get().maxPly)})
    },
    advancePly: () => {        
        const { moveTo, ply} = get()
        moveTo(ply+1)                
    },
    retreatPly: () => {
        const { moveTo, ply} = get()
        if (ply > 0) moveTo(ply - 1)
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