import type { Learning, LearningRecord } from "../learning/Learning"
import type { Problem } from "../problem/Problem"

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