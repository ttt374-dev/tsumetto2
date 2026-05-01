import { create } from "zustand"

import type { MissionId } from "@/domain/mission/entity/Mission"
import type { ProblemId } from "@/domain/problem/entity/Problem"

type PlannerStore = {
    missionId?: MissionId
    allIds: ProblemId[]
    chunkSize: number
    cursor: number

    create: (missionId: MissionId, ids: ProblemId[], chunkSize: number) => void
    nextChunk: () => ProblemId[] | null
    hasNext: () => boolean
    reset: () => void
}

export const usePlannerStore = create<PlannerStore>((set, get) => ({
    missionId: undefined,
    allIds: [],
    chunkSize: 5,
    cursor: 0,

    create: (missionId, ids, chunkSize) => {
        set({
            missionId,
            allIds: ids,
            chunkSize,
            cursor: 0,
        })
    },

    nextChunk: () => {
        const { allIds, cursor, chunkSize } = get()
        if (cursor >= allIds.length) return null
        const chunk = allIds.slice(cursor, cursor + chunkSize)
        set({ cursor: cursor + chunk.length })

        return chunk
    },

    hasNext: () => {
        const { cursor, allIds } = get()
        return cursor < allIds.length
    },

    reset: () => {
        set({
            missionId: undefined,
            allIds: [],
            cursor: 0,
        })
    }
}))