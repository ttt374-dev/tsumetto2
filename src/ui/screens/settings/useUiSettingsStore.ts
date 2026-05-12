import { create } from "zustand"
import { persist } from "zustand/middleware"

type UiSettings = {

    
    chunkSize: number
    showElapsedSec: boolean
    soundEffect: boolean    
}
type UiSettingsState = {
    settings: UiSettings
    setSettings: (partial: Partial<UiSettings>) => void
}

const defaultUiSettings: UiSettings = {
  chunkSize: 5,
  showElapsedSec: true,
  soundEffect: true,
}

export const useUiSettingsStore = create<UiSettingsState>()(
    persist(
        (set) => ({
            settings: {...defaultUiSettings},
            setSettings: (partial) =>
                set((s) => ({
                    settings: { ...s.settings, ...partial },
                })),
        }),
        {
            name: "ui-settings", // localStorage key
            merge: (persisted, current) => {
                const persistedState =
                    persisted as Partial<UiSettingsState>

                return {
                    ...current,
                    ...persistedState,

                    settings: {
                        ...current.settings,
                        ...persistedState.settings,
                    },
                }
            },
        }
    )
)