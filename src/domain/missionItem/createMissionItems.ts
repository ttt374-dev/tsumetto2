import type { LearningRecord } from "../learning/Learning"
import type { Problem } from "../problem/Problem"
import { MissionItem } from "./MissionItem"

export function createMissionItems(
    problems: Problem[], learningRecords: LearningRecord,
    
) {

    const items = problems.map((p) => (
        new MissionItem(p, learningRecords[p.id])
    ))
    
    return items
}