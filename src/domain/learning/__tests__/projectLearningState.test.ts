import { describe, it, expect } from "vitest"
import { projectLearningState } from "@/domain/learning/service/projectLearningState"
import { Problem } from "@/domain/problem/entity/Problem"
import type { ReviewReviewedEvent } from "@/domain/review/ReviewEvent"
import { createDefaultSolvedResult } from "@/domain/review/solvedResult"

describe("projectLearningState", () => {
    it("review", () => {
        const p1 = Problem.create()
        const e1: ReviewReviewedEvent = {
            type: "reviewed",
            id: "e1",
            reviewId: "r1",
            problemId: p1.id,
            sessionId: "session",
            solvedResult: createDefaultSolvedResult({isSolved: true}),
            at: Date.now(),

        }        
        const e2: ReviewReviewedEvent = {
            type: "reviewed",
            id: "e2",
            reviewId: "r1",
            problemId: p1.id,
            sessionId: "session",
            solvedResult: createDefaultSolvedResult({isSolved: true}),
            at: Date.now(),

        }    
        let events = [e1, e2]
        let records = projectLearningState(events)
        let s = records[p1.id]
        //console.log("score", s.score)

        expect(s.lastEvent?.problemId).toEqual(p1.id)
        expect(s.stats.attemptCount).toEqual(2)
        expect(s.stats.solvedCount).toEqual(2)
        expect(s.stats.failedCount).toEqual(0)
        expect(s.schedulingState.stepIndex).toEqual(2)
        expect(s.schedulingState.queue).toEqual("learn")

        // ３問連続正解で learn -> review に
        const e3: ReviewReviewedEvent = {
            type: "reviewed",
            id: "e3",
            reviewId: "r1",
            problemId: p1.id,
            sessionId: "session",
            solvedResult: createDefaultSolvedResult({isSolved: true}),
            at: Date.now(),
        }  
        events = [e1, e2, e3] 
        records = projectLearningState(events)
        s = records[p1.id]
        expect(s.schedulingState.queue).toEqual("review")

        // 間違ったら relearnに
        const e4: ReviewReviewedEvent = {
            type: "reviewed",
            id: "e4",
            reviewId: "r1",
            problemId: p1.id,
            sessionId: "session",
            solvedResult: createDefaultSolvedResult({isSolved: false}),
            at: Date.now(),
        }
        events = [...events, e4]
        records = projectLearningState(events)
        s = records[p1.id]
        expect(s.schedulingState.queue).toEqual("relearn")
    })
})