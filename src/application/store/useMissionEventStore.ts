import { useEffect, useReducer, useRef, useState } from "react"
import type { MissionEvent, MissionProblemAnswered, MissionSnapshot, MissionStarted } from "../../domain/MissionEvent/MissionEvent"
import { projectMission } from "../../domain/MissionEvent/projectionMission"
import type { ProblemId } from "@/domain/problem/Problem"
import type { SolvedResult } from "@/domain/MissionEvent/MissionSummary"

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
//////////////////////////////////////////////////
export function useMissionEventStore() {
    const [state, dispatch] = useReducer(missionReducer, {
        eventLog: [],
        snapshot: null,
    })

    const start = (ids: ProblemId[]) => {
        const ev: Omit<MissionStarted, "at"> = {
            type: "MissionStarted",
            missionId: crypto.randomUUID(),
            problemIds: ids
        }
        append(ev)
    }
    const answer = (problemId: ProblemId, solvedResult: SolvedResult, secToTaken?: number) => {
        if (!state.snapshot) return
        const missionEvent: Omit<MissionProblemAnswered, "at"> = {
            type: "MissionProblemAnswered",
            missionId: state.snapshot.missionId,
            problemId: problemId as ProblemId,
            result: solvedResult,
            sec: secToTaken,
        }
        append(missionEvent)
    }
    const finish = () => {
        state.snapshot &&
            append({
                type: "MissionFinished",
                missionId: state.snapshot.missionId
            })
    }
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

        start, answer, finish,
        append,
        reset,
    }
}
