import type { Problem } from "@/domain/problem/entity/Problem"
import type { ProblemType } from "@/domain/problem/entity/ProblemType"
import { isRegExp } from "lodash"

export type ProblemEditDraft = {
    title: string
    tags: string[]
    starred: boolean
    isReferenceOnly: boolean
    type: ProblemType
    source: string
    comment: string
}

export function toEditDraft(problem: Problem): ProblemEditDraft {
    return {
        title: problem.title,
        tags: problem.tags ?? [],
        starred: problem.isStarred,
        isReferenceOnly: problem.isReferenceOnly,
        type: problem.type ?? "standard",
        source: problem.source ?? "",
        comment: problem.comment,
    }
}
export function createEditDraft(): ProblemEditDraft {
    return {
        title: "", tags: [], starred: false, isReferenceOnly: false,
        type: "standard", source: "", comment: "",
    }
}
export function applyDraftToProblem(
    prev: Problem,
    draft: ProblemEditDraft
): Problem {
    return prev
        .setTitle(draft.title)
        .setSource(draft.source)
        .setTags(draft.tags)
        .setStarred(draft.starred)
        .setReferenceOnly(draft.isReferenceOnly)
        .setType(draft.type)
        .setComment(draft.comment)
}

