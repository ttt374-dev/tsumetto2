import type { ProblemEditDraft } from "@/ui/screens/detail/hooks/useProblemEditDraft"
import { create } from "zustand"

type ProblemEditState = {
    // state
    draft: ProblemEditDraft | null

    // actions
    setDraft: (d: ProblemEditDraft) => void

    updateField: <K extends keyof ProblemEditDraft>(
        key: K,
        value: ProblemEditDraft[K]
    ) => void

    toggleStar: () => void
    toggleReferenceOnly: () => void
}
export const useProblemEditStore = create<ProblemEditState>((set) => ({
    draft: null,

    setDraft: (d) => {
        set({ draft: { ...d } })
    },
    updateField: (key, value) => {
        set(state => {
            if (!state.draft) return state

            return {
                draft: {
                    ...state.draft,
                    [key]: value,
                }
            }
        })
    },

    toggleStar: () => {
        set(state => {
            if (!state.draft) return state

            return {
                draft: {
                    ...state.draft,
                    starred: !state.draft.starred,
                }
            }
        })
    },
    toggleReferenceOnly: () => {
        set(state => {
            if (!state.draft) return state

            return {
                draft: {
                    ...state.draft,
                    isReferenceOnly:
                        !state.draft.isReferenceOnly,
                }
            }
        })
    },

}))