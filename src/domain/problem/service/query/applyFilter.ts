import type { Learning, LearningRecord } from "@/domain/learning/entity/Learning";
import { matchMateBuckets } from "./mateFilter";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import type { QueryState } from "./ProblemsQuery";
import type { LearningState } from "@/domain/learning/entity/LearningState";

//////////////////////////////////
export const applyFilter = (
    problems: Problem[],
    learningRecords: Record<ProblemId, LearningState>,
    queryState: QueryState
): Problem[] => {
    const now = Date.now()
    
    const predicates: Array<(problem: Problem, learning: LearningState | undefined) => boolean> = [
        // 未回答のみ
        (_, learning) =>
            !queryState.unansweredOnly ||
            !(learning && learning.solvedCount + learning.failedCount > 0),

        // 問題タイプ
        (problem, _) =>
            !queryState.problemType ||
            problem.type === queryState.problemType,

        // 出典
        (problem, learning) =>
            !queryState.source ||
            problem.source === undefined || 
            problem.source === queryState.source,

        // ミッション対象
        (_problem, learning) =>
            !queryState.dueForReviewOnly ||
            learning?.nextReviewedAt === undefined ||
            learning.nextReviewedAt <= now,

        // スターつきのみ
        (problem, _) =>
            !queryState.starredOnly ||
            problem.starred,

        // 手数
        //(e) =>
        //  !filter.mateLength ||
        //  matchMateLength(e.problem.kifData, filter.mateLength),
        // 手数バケット
        (problem, _) =>
            !queryState.mateBuckets ||
            matchMateBuckets(problem.kifData.moves.length, queryState.mateBuckets),
        // tags
        (problem, _) => 
            !queryState.tags || queryState.tags.length === 0 || 
            queryState.tags!.some(tag => problem.tags.includes(tag)),

        // 🔍 text filter
        (problem, _) =>
            !queryState.text ||
            queryState.text.trim() === "" ||
            problem.title.toLowerCase().includes(queryState.text.toLowerCase()),

    ]
    return problems.filter(problem => 
        predicates.every(p => p(problem, learningRecords[problem.id])
    ))

}
