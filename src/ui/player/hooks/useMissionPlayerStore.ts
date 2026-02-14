import { create } from "zustand"
import type { ProblemId } from "@/domain/problem/Problem"
import type { SolvedResult } from "@/domain/learning/Learning"
import type { MissionEventStore } from "@/application/store/useMissionEventStore"

export type MissionPlayerState = {
    snapshot: { problemIds: ProblemId[] }   // 常に存在
    currentProblemId?: ProblemId
    index: number

    // --- external dependency ---
    missionEventStore?: MissionEventStore
    setMissionEventStore: (store: MissionEventStore) => void

    // --- actions ---
    setSnapshot: (snapshot: { problemIds: ProblemId[] }) => void
    moveTo: (id: ProblemId) => void
    next: () => void
    prev: () => void
    answer: (id: ProblemId, solvedResult: SolvedResult, secToTaken?: number) => void
}

export const useMissionPlayerStore = create<MissionPlayerState>((set, get) => ({
    // --- initial state ---
    snapshot: { problemIds: [] },
    currentProblemId: undefined,
    index: -1,
    missionEventStore: undefined,

    // --- external dependency setter ---
    setMissionEventStore: (store) => set({ missionEventStore: store }),

    // --- snapshot / initialization ---
    setSnapshot: (snapshot) => {
        const ids = snapshot.problemIds
        const current = ids.length > 0 ? ids[0] : undefined
        set({ snapshot, currentProblemId: current, index: current ? 0 : -1 })
    },

    // --- navigation ---
    moveTo: (id) => {
        const idx = get().snapshot.problemIds.indexOf(id)
        if (idx === -1) return
        set({ currentProblemId: id, index: idx })
    },

    next: () => {
        const { currentProblemId, snapshot, missionEventStore } = get()
        if (!currentProblemId || !missionEventStore) return

        const ids = snapshot.problemIds
        const idx = ids.indexOf(currentProblemId)
        if (idx === -1) return

        if (idx < ids.length - 1) {
            set({ currentProblemId: ids[idx + 1], index: idx + 1 })
            console.log("mission: next", idx+1, currentProblemId)
        } else {
            missionEventStore.finish()
            set({ currentProblemId: undefined, index: -1 })
        }
        
    },

    prev: () => {
        const { currentProblemId, snapshot } = get()
        if (!currentProblemId) return

        const ids = snapshot.problemIds
        const idx = ids.indexOf(currentProblemId)
        if (idx > 0) set({ currentProblemId: ids[idx - 1], index: idx - 1 })
    },

    answer: (id, solvedResult, secToTaken) => {
        const { missionEventStore } = get()
        if ( !missionEventStore) return
        missionEventStore.answer(id, solvedResult, secToTaken)
        console.log("mission answer", id, solvedResult)
        get().next()
    },
}))
