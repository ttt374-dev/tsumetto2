import { create } from "zustand"
import type { Mission } from "@/domain/mission/entity/Mission"
import { createDefaultMission } from "@/domain/mission/entity/createDefaultMission"
import type { QueryState } from "@/domain/problem/service/query/ProblemsQuery"

type MissionEditorState = {
    draft: Mission | null

    startNew: () => void
    startEdit: (mission: Mission) => void

    setName: (name: string) => void
    setQuery: (snapshot: Mission["queryState"]) => void    

    reset: () => void
}

export const useMissionEditorStore = create<MissionEditorState>((set) => ({
    draft: null,

    startNew: () =>
        set({
            draft: createDefaultMission(),
        }),

    startEdit: (mission) =>
        set({
            draft: { ...mission }, // コピー重要
        }),

    setName: (name) =>
        set((state) =>
            state.draft
                ? { draft: { ...state.draft, name } }
                : state
        ),

    setQuery: (query) =>
        set((state) =>
            state.draft
                ? { draft: { ...state.draft, snapshot: query } }
                : state
        ),

    reset: () => set({ draft: null }),
}))
