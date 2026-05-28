import type { Player } from "@/domain/kif/entity"
import type { Problem } from "@/domain/problem/entity/Problem"
import type { ProblemType } from "@/domain/problem/entity/ProblemType"

export type ProblemEditDraft = {
    title: string
    tags: string[]
    starred: boolean
    isReferenceOnly: boolean
    type: ProblemType
    source: string
    comment: string
    hint: string
    userSide: Player
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
        hint: problem.hint,
        userSide: problem.userSide,
    }
}
export function createEditDraft(): ProblemEditDraft {
    return {
        title: "", tags: [], starred: false, isReferenceOnly: false,
        type: "standard", source: "", comment: "", hint: "", userSide: "black",
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
        .setHint(draft.hint)
        .setUserSide(draft.userSide)
}

