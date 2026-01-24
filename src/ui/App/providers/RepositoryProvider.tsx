import type { ReactNode, } from "react"
import { createContext, useContext, useState, useRef } from "react"
import { FileProblemPersistence, ProblemRepository } from "@/domain/problem/ProblemRepository"
import { JsonLearningEventPersistence, LearningEventRepository } from "@/domain/LearningEvent/LearningEventRepository"

type RepositoryContextValue = {
    readonly problem: ProblemRepository
    readonly learningEvent: LearningEventRepository
}
export const RepositoryContext = createContext<RepositoryContextValue | null>(null)

export const RepositoryProvider = ({ children }: { children: ReactNode }) => {
    const problemRepoRef = useRef<ProblemRepository|null>(null)
    const learningEventLogRepoRef = useRef<LearningEventRepository>(null)

    if (!problemRepoRef.current) {
        problemRepoRef.current = new ProblemRepository(new FileProblemPersistence())
    }
    if (!learningEventLogRepoRef.current){
        const persistence = new JsonLearningEventPersistence()
        learningEventLogRepoRef.current = new LearningEventRepository(persistence)
    }
    return (
        <RepositoryContext.Provider value={{
            problem: problemRepoRef.current,
            learningEvent: learningEventLogRepoRef.current,
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
