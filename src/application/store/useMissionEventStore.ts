import { useEffect, useRef, useState } from "react"
import type { MissionEvent, MissionSnapshot } from "../../domain/MissionEvent/MissionEvent"
import { projectMission } from "../../domain/MissionEvent/projectionMission"

export function useMissionEventStore() {
    const [eventLog, setEventLog] = useState<MissionEvent[]>([])
    const [snapshot, setSnapshot] = useState<MissionSnapshot | null>(null)

    useEffect(()=>{
        reset()
    }, [])    
    

    const append = <E extends MissionEvent>(
        event: Omit<E, "at">
    ) => {
        const e = { ...event, at: Date.now() } as E
        setEventLog(prev => {
            const next = [...prev, e]
            setSnapshot(projectMission(next))
            return next
        })
    }

    const reset = () => {
        setEventLog([])
        setSnapshot(null)
    }


    return { eventLog, snapshot, append, reset }
}

