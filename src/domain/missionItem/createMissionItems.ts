import type { LearningRecord } from "../learning/Learning"
import type { Problem } from "../problem/Problem"

export function createMissionItems(
    problems: Problem[], learningRecords: LearningRecord,
    
) {
    const items = problems.map((p) => ({
        problem: p,
        learning: learningRecords[p.id]
    }))
    return items
}