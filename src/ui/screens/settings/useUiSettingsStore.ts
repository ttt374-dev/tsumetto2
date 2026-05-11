import { create } from "zustand"
import { persist } from "zustand/middleware"

type UiSettings = {

    
    chunkSize: number
    showElapsedSec: boolean
    //pageSize: number
    //listDensity: "compact" | "comfortable"
    //missionExecutionMode: MissionExecutionMode
    //missionPartialLimit: number
}
type UiSettingsState = {
    settings: UiSettings
    setSettings: (partial: Partial<UiSettings>) => void
}


const defaultUiSettings: UiSettings = {
  chunkSize: 5,
  showElapsedSec: true,
}


export const useUiSettingsStore = create<UiSettingsState>()(
    persist(
        (set) => ({
            settings: {
                pageSize: 20,
                showElapsedSec: true,
                listDensity: "comfortable",
                missionExecutionMode: "full",
                missionPartialLimit: 10,
                chunkSize: 5,
            },
            setSettings: (partial) =>
                set((s) => ({
                    settings: { ...s.settings, ...partial },
                })),
        }),
        {
            name: "ui-settings", // localStorage key
        }
    )
)