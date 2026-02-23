// domain/problemRecord/sortProblemRecords.ts

import type { Learning } from "@/domain/learning/entity/Learning";
import type { SortOrder, SortState } from "./sort"
import type { Problem, ProblemId } from "@/domain/problem/entity/Problem"

//type SortKey = SortState["key"]
//type SortValue = string | number

export function applySort(
    problems: Problem[],
    learningRecords: Record<ProblemId, Learning>,
    sortState: SortState
): Problem[] {
    return [...problems].sort((a, b) => {
        const la = learningRecords[a.id];
        const lb = learningRecords[b.id];

        let vA: number | string = 0;
        let vB: number | string = 0;

        switch (sortState.key) {
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
            case "random":
                vA = Math.random()
                vB = Math.random()
                break;
        }

        if (vA < vB) return sortState.order === "asc" ? -1 : 1;
        if (vA > vB) return sortState.order === "asc" ? 1 : -1;
        return 0;
    });
}
