import { createProblemWithLearningList, type ProblemWithLearning } from "../PwL";
import type { FilterState } from "./filter";
import { matchMateBuckets } from "./mateFilter";
import type { LearningRecord } from "@/domain/learning/Learning";
import type { Problem } from "@/domain/problem/Problem";


//////////////////////////////////
export const applyFilter = (
    problems: Problem[],
    learningRecords: LearningRecord,
    filter: FilterState
): Problem[] => {
    const now = Date.now()

    const predicates: Array<(pwl: ProblemWithLearning) => boolean> = [
        // 未回答のみ
        (e) =>
            !filter.unansweredOnly ||
            !(e.learning && e.learning.solvedCount + e.learning.failedCount > 0),

        // ミッション対象
        (e) =>
            !filter.isMissionTarget ||
            e.learning?.nextReviewedAt === undefined ||
            e.learning.nextReviewedAt <= now,

        // スターつきのみ
        (e) =>
            !filter.starredOnly ||
            e.problem.starred,

        // 手数
        //(e) =>
        //  !filter.mateLength ||
        //  matchMateLength(e.problem.kifData, filter.mateLength),
        // 手数バケット
        (e) =>
            !filter.mateBuckets ||
            matchMateBuckets(e.problem.kifData.moves.length, filter.mateBuckets),
        // tags
        (e) => 
            !filter.tags || filter.tags.length === 0 || 
            filter.tags!.some(tag => e.problem.tags.includes(tag))

    ]

    const list = createProblemWithLearningList(problems, learningRecords)
    return list.filter(e =>
        predicates.every(p => p(e))
    ).map(e => e.problem)
}
