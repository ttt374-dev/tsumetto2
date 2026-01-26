import type { ReactNode, } from "react"
import { createContext, useContext, useState, useRef } from "react"
import { useMissionEventStore } from "@/application/store/useMissionEventStore"

type MissionEventStoreContextValue = ReturnType<typeof useMissionEventStore>
export const MissionEventStoreContext = createContext<MissionEventStoreContextValue | null>(null)

export const MissionEventStoreProvider = ({ children }: { children: ReactNode }) => {
    const store = useMissionEventStore()
    return (
        <MissionEventStoreContext.Provider value={store}>
            {children}
        </MissionEventStoreContext.Provider>
    )
}
export function useMissionEventStoreContext() {
    const ctx = useContext(MissionEventStoreContext)
    if (!ctx) throw new Error("context provider error");
    return ctx;
}
