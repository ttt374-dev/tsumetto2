import { useEffect, useReducer, useRef, useState } from "react"
import type { MissionEvent, MissionProblemAnswered, MissionSnapshot, MissionStarted } from "../../domain/MissionEvent/MissionEvent"
import { projectMission } from "../../domain/MissionEvent/projectionMission"
import type { ProblemId } from "@/domain/problem/Problem"
import type { SolvedResult } from "@/domain/learning/Learning"

export type MissionPhase = "playing" | "finished";

export type MissionState = {
    phase: MissionPhase;
    eventLog: MissionEvent[];
    snapshot: MissionSnapshot;
};

type MissionAction =
    | { type: "append"; event: MissionEvent }
    | { type: "reset" }

function missionReducer(
    state: MissionState,
    action: MissionAction
): MissionState {
    switch (action.type) {
        case "append": {
            const event = action.event
            const nextLog = [...state.eventLog, event]
            const nextSnapshot = projectMission(nextLog)

            return {
                ...state,
                eventLog: nextLog,
                snapshot: nextSnapshot,
                phase: nextSnapshot.phase,
            }
        }
        case "reset":
            return { eventLog: [], phase: "playing", snapshot: projectMission([]) }
    }
}
//////////////////////////////////////////////////
export function useMissionEventStore() {
    const [state, dispatch] = useReducer(missionReducer, {
        eventLog: [],
        phase: "playing",
        snapshot: projectMission([]),
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
        //if (!state.snapshot) return
        if (state.phase !== "playing") return
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
        if (state.phase !== "playing") return
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
