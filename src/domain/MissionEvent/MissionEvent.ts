import type { MissionPhase } from "@/application/store/useMissionEventStore"
import type { SolvedResult } from "../learning/Learning"
import type { ProblemId } from "../problem/Problem"

export type MissionId = string


export type MissionResultEntry = {
    problemId: ProblemId,
    solvedResult: SolvedResult,
}


export type MissionEvent =
    | MissionStarted
    | MissionProblemAnswered
    | MissionFinished

export type MissionStarted = {
    type: "MissionStarted"
    missionId: MissionId
    problemIds: ProblemId[]
    at: number
}
export type MissionProblemAnswered = {
    type: "MissionProblemAnswered"
    missionId: MissionId
    problemId: ProblemId
    result: SolvedResult   // "solved" | "failed"
    easy?: boolean
    sec?: number
    at: number
}
export type MissionFinished = {
    type: "MissionFinished"
    missionId: MissionId
    at: number
}

////////////////////////////////////////
export type MissionSnapshot = {
    missionId: MissionId
    phase: MissionPhase

    problemIds: ProblemId[]
    answered: Record<ProblemId, MissionProblemAnswered>

    solvedCount: number
    failedCount: number
}

