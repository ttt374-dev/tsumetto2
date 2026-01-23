import type { ProblemId } from "../problem/Problem"
import type { Learning, LearningRecord } from "./Learning"

export interface LearningRepository {
    load(): Promise<LearningRecord>
    save(problems: LearningRecord): Promise<void>
    removeMany(problemIds: ProblemId[]): Promise<void>

    //add(Learning: Learning): Promise<void>
    //update(Learning: Learning): Promise<void>    
}