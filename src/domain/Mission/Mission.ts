import type { SolvedResult } from "../learning/Learning"
import type { ProblemId } from "../problem/Problem"

export type MissionId = string

export type MissionResultEntry = {
    problemId: ProblemId,
    solvedResult: SolvedResult,
}

export type MissionPhase =
    | "idle"
    | "playing"
    | "finished";
