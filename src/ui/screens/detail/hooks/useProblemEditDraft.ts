import type { ProblemType } from "@/domain/problem/entity/ProblemType"

export type ProblemEditDraft = {
    title: string
    tags: string[]
    starred: boolean
    isReferenceOnly: boolean
    type: ProblemType
    source: string
    comment: string
}


export function useProblemEditDraft(){

}