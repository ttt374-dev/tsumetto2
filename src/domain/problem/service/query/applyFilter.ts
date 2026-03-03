import type { Learning, LearningRecord } from "@/domain/learning/entity/Learning";
import type { FilterState } from "./filter";
import { matchMateBuckets } from "./mateFilter";
import type { Problem } from "@/domain/problem/entity/Problem";
import type { QueryState } from "./ProblemsQuery";

//////////////////////////////////
export const applyFilter = (
    problems: Problem[],
    learningRecords: LearningRecord,
    filter: QueryState
): Problem[] => {
    const now = Date.now()
    
    const predicates: Array<(problem: Problem, learning: Learning | undefined) => boolean> = [
        // 未回答のみ
        (_, learning) =>
            !filter.unansweredOnly ||
            !(learning && learning.solvedCount + learning.failedCount > 0),

        // 問題タイプ
        (problem, _) =>
            !filter.problemType ||
            problem.type === filter.problemType,

        // 出典
        (problem, learning) =>
            !filter.source ||
            problem.source === undefined || 
            problem.source === filter.source,

        // ミッション対象
        (_problem, learning) =>
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
