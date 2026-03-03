// domain/problemRecord/sortProblemRecords.ts

import type { Learning } from "@/domain/learning/entity/Learning";
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"
import type { QueryState } from "./ProblemsQuery";

//type SortKey = SortState["key"]
//type SortValue = string | number

export function applySort(
    problems: Problem[],
    learningRecords: Record<ProblemId, Learning>,
    queryState: QueryState
): Problem[] {
    return [...problems].sort((a, b) => {
        const la = learningRecords[a.id];
        const lb = learningRecords[b.id];

        let vA: number | string = 0;
        let vB: number | string = 0;

        switch (queryState.sortKey) {
            case "createdAt":
                vA = a.createdAt
                vB = b.createdAt
                break;
            case "accuracy":
                vA = la?.accuracy
                vB = lb?.accuracy
                break;
            case "title":
                vA = a.title;
                vB = b.title;
                break;
            case "nextReviewedAt":
                vA = la?.nextReviewedAt ?? 0;
                vB = lb?.nextReviewedAt ?? 0;
                break;
            case "lastAnsweredAt":
                vA = la?.lastAnsweredAt ?? 0;
                vB = lb?.lastAnsweredAt ?? 0;
                break;
            case "random":
                vA = Math.random()
                vB = Math.random()
                break;
        }

        if (vA < vB) return queryState.sortOrder === "asc" ? -1 : 1;
        if (vA > vB) return queryState.sortOrder === "asc" ? 1 : -1;
        return 0;
    });
}
