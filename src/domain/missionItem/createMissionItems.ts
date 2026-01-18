import type { LearningRecord } from "../learning/Learning"
import type { Problem } from "../problem/Problem"
import type { MissionItem } from "./MissionItem"

export function createMissionItems(
    problems: Problem[], learningRecords: LearningRecord,
    
) {

    const items = problems.map((p) => (
        //new MissionItem(p, learningRecords[p.id])
        { problem: p, learning: learningRecords[p.id]}
    ))
    
    return items
}