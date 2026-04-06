import { type MissionExecutionMode } from "@/ui/screens/mission/components/MissionExecutionModeControl"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type UiSettings = {
    pageSize: number
    showSeconds: boolean
    listDensity: "compact" | "comfortable"
    missionExecutionMode: MissionExecutionMode
    missionPartialLimit: number
}

type UiSettingsState = {
    settings: UiSettings
    setSettings: (partial: Partial<UiSettings>) => void
}

export const useUiSettingsStore = create<UiSettingsState>()(
    persist(
        (set) => ({
            settings: {
                pageSize: 20,
                showSeconds: false,
                listDensity: "comfortable",
                missionExecutionMode: "full",
                missionPartialLimit: 10,
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