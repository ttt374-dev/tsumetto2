import type { ReactNode, } from "react"
import { createContext, useContext, useState, useRef } from "react"
import { LocalStorageReviewEventPersistence, ReviewEventRepository } from "@/domain/learning/repository/ReviewEventRepository"
import { MissionRepository, LocalStorageMissionPersistence} from "@/domain/mission/repository/MissionRepository"
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
