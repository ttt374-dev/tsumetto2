import { createProblemWithLearningList, type ProblemWithLearning } from "../PwL";
import type { FilterState } from "./filter";
import { matchMateBuckets } from "./mateFilter";
import type { Learning, LearningRecord } from "@/domain/learning/Learning";
import type { Problem } from "@/domain/problem/Problem";


//////////////////////////////////
export const applyFilter = (
    problems: Problem[],
    learningRecords: LearningRecord,
    filter: FilterState
): Problem[] => {
    const now = Date.now()
    
    const predicates: Array<(problem: Problem, learning: Learning | undefined) => boolean> = [
        // 未回答のみ
        (_, learning) =>
            !filter.unansweredOnly ||
            !(learning && learning.solvedCount + learning.failedCount > 0),

        // ミッション対象
        (problem, learning) =>
            !filter.dueForReviewOnly ||
            learning?.nextReviewedAt === undefined ||
            learning.nextReviewedAt <= now,

        // スターつきのみ
        (problem, _) =>
            !filter.starredOnly ||
            problem.starred,

        // 手数
        //(e) =>
        //  !filter.mateLength ||
        //  matchMateLength(e.problem.kifData, filter.mateLength),
        // 手数バケット
        (problem, _) =>
            !filter.mateBuckets ||
            matchMateBuckets(problem.kifData.moves.length, filter.mateBuckets),
        // tags
        (problem, _) => 
            !filter.tags || filter.tags.length === 0 || 
            filter.tags!.some(tag => problem.tags.includes(tag)),

        // 🔍 text filter
        (problem, _) =>
            !filter.text ||
            filter.text.trim() === "" ||
            problem.title.toLowerCase().includes(filter.text.toLowerCase()),

    ]
    return problems.filter(problem => 
        predicates.every(p => p(problem, learningRecords[problem.id])
    ))

}
