import type { SolvedResult } from "../MissionEvent/MissionSummary"
import type { ProblemId } from "../problem/Problem"

export type LearningEvent = {
    type: "reviewed"
    problemId: ProblemId
    quality: SolvedResult
    sec?: number
    at: number
}
export type LearningEventLog = LearningEvent[]
