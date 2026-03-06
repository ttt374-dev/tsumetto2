import type { LearningEventId } from "@/domain/learning/entity/LearningEvent";
import type { SolvedResult } from "../../learning/entity/Learning";
import type { ProblemId } from "../../problem/entity/Problem"

export type MissionId = string

export type MissionResultEntry = {
    problemId: ProblemId,
    missionId: MissionId,
    solvedResult: SolvedResult,
    //learningEventId: LearningEventId,
    secToTaken?: number,
}

export type MissionPhase =
    | "idle"
    | "playing"
    | "finished";
