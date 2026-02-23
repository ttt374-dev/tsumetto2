import type { Learning, LearningRecord } from "@/domain/learning/entity/Learning"
import type { Problem } from "../entity/Problem"

export type ProblemWithLearning = {
    problem: Problem    
    learning?: Learning
}

export function createProblemWithLearningList (
    problems: Problem[], learningRecords: LearningRecord,
): ProblemWithLearning[] {
    const items = problems.map((p) => (
        { problem: p, learning: learningRecords[p.id]}
    ))
    
    return items
}