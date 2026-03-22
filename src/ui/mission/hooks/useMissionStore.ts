import { create } from "zustand"

import type { MissionRepository } from "@/domain/mission/repository/MissionRepository"
import type { Mission, MissionId } from "@/domain/mission/entity/Mission"

type MissionStoreState = {
    repo?: MissionRepository
    setRepository: (repo: MissionRepository) => void
    missions: Mission[]
    reload: () => Promise<void>
    save: (mission: Mission) => void
    deleteMission: (id: MissionId) => void
    replaceAll: (missions: Mission[]) => void
}

export const useMissionStore = create<MissionStoreState>((set, get) => ({
    repo: undefined,
    setRepository: (repo) => set({ repo }),
    missions: [],
    reload: async () => {
        const repo = get().repo
        if (!repo) throw new Error("Repository not initialized")

        const list = await repo.findAll()
        console.log("load", list)
        set({ missions: list })
    },
    save: async (mission: Mission) => {
        console.log("save", mission)
        set(state => {
            const index = state.missions.findIndex(d => d.id === mission.id)
            const newMissions = [...state.missions]
            if (index >= 0) {
                newMissions[index] = mission
            } else {
                newMissions.push(mission)
            }
            return { missions: newMissions }
        })

    },
    deleteMission: (id: MissionId) => {
        set(state => ({ missions: state.missions.filter(d => d.id !== id) }))
    },

    replaceAll: (missions: Mission[]) => {
        set({ missions })
    },
}))
