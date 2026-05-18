import { create } from "zustand";

export type HintStore = {
    hintCommentVisible: boolean
    candidateVisible: boolean
    //enabled: boolean

    initialize: () => void
    //toggleEnabled: () => void
    toggleCandidateVisible: () => void

}

export const useHintStore = create<HintStore>((set, get) => ({
    hintCommentVisible: false,
    candidateVisible: false,
    //enabled: false,

    initialize: () => {
        set({candidateVisible: false})
    },

    toggleCandidateVisible: () => {
        set(s=>({candidateVisible: !s.candidateVisible}))
    }
    
}))