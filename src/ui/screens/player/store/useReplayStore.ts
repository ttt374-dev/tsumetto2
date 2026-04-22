import { create } from "zustand"

type ReplayPhase = "idle" | "animating"

export type ReplayStore = {
    ply: number
    maxPly: number | null
    phase: ReplayPhase

    initialize: (maxPly: number) => void
    //reset: () => void
    advancePly: () => void
    retreatPly: () => void
    moveTo: (ply: number) => void    
    startAnimation: () => void
    endAnimation: () => void
}

export const useReplayStore = create<ReplayStore>((set, get) => ({
    ply: 0,
    maxPly: null,
    phase: "idle",

    initialize: (maxPly) => {
        set({ maxPly, ply: 0, phase: "idle" })
    },

    moveTo: (ply) => {
        const { ply: current, maxPly } = get()
        if (maxPly === null) throw new Error("replay store not initialized")
        
        const next = ReplayEngine.moveTo({ ply: current, maxPly }, ply)
        set(next)
    },

    advancePly: () => {
        const { ply, maxPly } = get()
        if (maxPly === null) throw new Error("replay store not initialized")
        const next = ReplayEngine.advance({ ply, maxPly })
        set(next)
    },

    retreatPly: () => {
        const { ply, maxPly } = get()
        if (maxPly === null) throw new Error("replay store not initialized")
        const next = ReplayEngine.retreat({ ply, maxPly })
        set(next)
    },

    startAnimation: () => set({ phase: "animating" }),
    endAnimation: () => set({ phase: "idle" }),
}))

////////////////////////
export type ReplayState = {
    ply: number
    maxPly: number
}

export const ReplayEngine = {
    clamp(ply: number, maxPly: number) {
        return Math.max(0, Math.min(ply, maxPly))
    },

    moveTo(state: ReplayState, ply: number): ReplayState {
        return {
            ...state,
            ply: this.clamp(ply, state.maxPly)
        }
    },

    advance(state: ReplayState): ReplayState {
        return this.moveTo(state, state.ply + 1)
    },

    retreat(state: ReplayState): ReplayState {
        return this.moveTo(state, state.ply - 1)
    }
}