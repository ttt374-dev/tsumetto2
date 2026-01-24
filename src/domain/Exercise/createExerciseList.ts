import type { LearningRecord } from "../learning/Learning"
import type { Problem } from "../problem/Problem"
import type { Exercise } from "./Exercise"

export function createExerciseList(
    problems: Problem[], learningRecords: LearningRecord,
) {
    const items = problems.map((p) => (
        { problem: p, learning: learningRecords[p.id]}
    ))
    
    return items
}