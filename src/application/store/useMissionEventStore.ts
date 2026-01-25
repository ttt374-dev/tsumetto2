import { useEffect, useReducer, useRef, useState } from "react"
import type { MissionEvent, MissionSnapshot } from "../../domain/MissionEvent/MissionEvent"
import { projectMission } from "../../domain/MissionEvent/projectionMission"

type MissionState = {
  eventLog: MissionEvent[]
  snapshot: MissionSnapshot | null
}
type MissionAction =
  | { type: "append"; event: MissionEvent }
  | { type: "reset" }

function missionReducer(
  state: MissionState,
  action: MissionAction
): MissionState {
  switch (action.type) {
    case "append": {
      const nextLog = [...state.eventLog, action.event]
      return {
        eventLog: nextLog,
        snapshot: projectMission(nextLog),
      }
    }
    case "reset":
      return { eventLog: [], snapshot: null }
  }
}

export function useMissionEventStore() {
  const [state, dispatch] = useReducer(missionReducer, {
    eventLog: [],
    snapshot: null,
  })

  const append = <E extends MissionEvent>(event: Omit<E, "at">) => {
    dispatch({
      type: "append",
      event: { ...event, at: Date.now() } as E,
    })
  }
  const reset = () => dispatch({ type: "reset" })

  return {
    eventLog: state.eventLog,
    snapshot: state.snapshot,
    append,
    reset,
  }
}

/*
////////////////////////////
export function useMissionEventStoreOrig() {
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

*/