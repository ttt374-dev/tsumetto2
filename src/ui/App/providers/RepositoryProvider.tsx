import type { ReactNode, } from "react"
import { createContext, useContext, useState, useRef } from "react"
import { LocalStorageLearningEventPersistence, LearningEventRepository } from "@/domain/learning/repository/LearningEventRepository"
import { MissionRepository, LocalStorageMissionPersistence} from "@/domain/mission/repository/MissionRepository"
import type { ProblemRepository } from "@/domain/problem/repository/ProblemRepository"

export type RepositoryContextValue = {
    readonly problem: ProblemRepository
    readonly learningEvent: LearningEventRepository
    readonly mission: MissionRepository
}
export const RepositoryContext = createContext<RepositoryContextValue | null>(null)

export function useRepositoryContext() {
    const ctx = useContext(RepositoryContext)
    if (!ctx) throw new Error("context provider error");
    return ctx;
}
