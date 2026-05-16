import { create } from "zustand";

export type HintStore = {
    enabled: boolean

    initialize: () => void
    toggleEnabled: () => void
}

export const useHintStore = create<HintStore>((set, get) => ({
    enabled: false,

    initialize: () => {
        set({enabled: false})
    },
    toggleEnabled: () => {
        set(s=>({enabled: !s.enabled}))
    }

}))