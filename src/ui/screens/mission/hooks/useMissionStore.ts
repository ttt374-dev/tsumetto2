import { create } from "zustand"

import type { MissionRepository } from "@/domain/mission/repository/MissionRepository"
import type { Mission, MissionId } from "@/domain/mission/entity/Mission"

type MissionStoreState = {
    repo?: MissionRepository
    setRepository: (repo: MissionRepository) => void
    missions: Mission[]
    reload: () => Promise<void>
    patchMission: (mission: Mission) => void
    removeMission: (id: MissionId) => void
    /*
    save: () => Promise<void>
    saveMission: (mission: Mission) => void    
    deleteMission: (id: MissionId) => void
    
*/
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
     patchMission: (mission) => {
        set(state => {
            const index = state.missions.findIndex(m => m.id === mission.id)

            // insert
            if (index === -1) {
                return {
                    missions: [
                        ...state.missions,
                        mission,
                    ]
                }
            }

            // update
            const next = [...state.missions]
            next[index] = mission

            return { missions: next }
        })
    },
    removeMission: (id) => {
        set(state => ({
            missions:
                state.missions.filter(
                    m => m.id !== id
                )
        }))
    },
/*
    saveMission: async (mission: Mission) => {
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
        get().save()

    },
    save: async () => {
        const repo = get().repo
        if (!repo) throw new Error("Repository not initialized")
        repo.replaceAll(get().missions)
    },
    deleteMission: (id: MissionId) => {
        set(state => ({ missions: state.missions.filter(d => d.id !== id) }))
        get().save()  
    },
*/
    replaceAll: (missions: Mission[]) => {
        set({ missions })
        //get().save()  
    },
}))
