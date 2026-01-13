import type { Learning, LearningRecord } from "./Learning"

export interface LearningRepository {
    load(): Promise<LearningRecord>
    save(problems: LearningRecord): Promise<void>

    //add(Learning: Learning): Promise<void>
    //update(Learning: Learning): Promise<void>    
}