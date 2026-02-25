import type { SolvedResult } from "../../learning/entity/Learning";
import type { ProblemId } from "../../problem/entity/Problem"

export type MissionId = string

export type MissionResultEntry = {
    problemId: ProblemId,
    solvedResult: SolvedResult,
    secToTaken?: number,
}

export type MissionPhase =
    | "idle"
    | "playing"
    | "finished";
