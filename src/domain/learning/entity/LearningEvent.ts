import type { MissionId } from "@/domain/mission/entity/Mission"
import type { ProblemId } from "../../problem/entity/Problem"
import type { SolvedResult } from "./Learning"

export type LearningEventId = string

export type NewLearningEvent =
    | NewLearningReviewedEvent
    | NewLearningResetEvent
    | NewLearningCancelEvent

type NewLearningReviewedEvent =
    {
        type: "reviewed"
        problemId: ProblemId
        missionId: MissionId
        quality: SolvedResult
        sec?: number
    }

type NewLearningResetEvent =
    {
        type: "reset"
        problemId: ProblemId
    }

type NewLearningCancelEvent =
    {
        type: "cancel"
        //missionId: MissionId
        targetEventId: LearningEventId
    }

export type LearningEvent =
    NewLearningEvent & { id: LearningEventId, at: number }

export type LearningReviewedEvent = Extract<LearningEvent, { type: "reviewed" }>;

export type LearningEventLog = LearningEvent[]
