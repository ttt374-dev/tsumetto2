import { createContext, useContext } from "react"
import { ReviewEventRepository } from "@/domain/review/repository/ReviewEventRepository"
import { MissionRepository} from "@/domain/mission/repository/MissionRepository"
import type { ProblemRepository } from "@/domain/problem/repository/ProblemRepository"

export type RepositoryContextValue = {
    readonly problem: ProblemRepository
    readonly reviewEvent: ReviewEventRepository
    readonly mission: MissionRepository
}
export const RepositoryContext = createContext<RepositoryContextValue | null>(null)

export function useRepositoryContext() {
    const ctx = useContext(RepositoryContext)
    if (!ctx) throw new Error("context provider error");
    return ctx;
}
