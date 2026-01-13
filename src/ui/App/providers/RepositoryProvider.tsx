import type { ReactNode, } from "react"
import { createContext, useContext, useState, useRef } from "react"
import type { LearningRepository } from "@/domain/learning/LearningRepository"
import type { ProblemRepository } from "@/domain/problem/ProblemRepository"
import { ProblemFileRepository } from "@/infra/problemRepository/ProblemFileRepository"
import { LearningFileRepository } from "@/infra/problemRepository/LearningFileRepository"

type RepositoryContextValue = {
    readonly problem: ProblemRepository
    readonly learning: LearningRepository
}
export const RepositoryContext = createContext<RepositoryContextValue | null>(null)

export const RepositoryProvider = ({ children }: { children: ReactNode }) => {
    const problemRepoRef = useRef<ProblemRepository|null>(null)
    const learningRepoRef = useRef<LearningRepository|null>(null)

    if (!problemRepoRef.current) {
        problemRepoRef.current = new ProblemFileRepository()
    }
    if (!learningRepoRef.current) {
        learningRepoRef.current = new LearningFileRepository()
    }
    return (
        <RepositoryContext.Provider value={{
            problem: problemRepoRef.current,
            learning: learningRepoRef.current,
        }}>
            {children}
        </RepositoryContext.Provider>
    )

}
export function useRepositoryContext() {
    const ctx = useContext(RepositoryContext)
    if (!ctx) throw new Error("context provider error");
    return ctx;
}
