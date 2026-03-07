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

/*
export const RepositoryProvider = ({ children }: { children: ReactNode }) => {
    const problemRepoRef = useRef<ProblemRepository|null>(null)
    const learningEventLogRepoRef = useRef<LearningEventRepository>(null)
    const deckRepoRef = useRef<DeckRepository>(null)

    if (!problemRepoRef.current) {
        problemRepoRef.current = new ProblemRepository(new FileProblemPersistence())
    }
    if (!learningEventLogRepoRef.current){
        const persistence = new JsonLearningEventPersistence()
        learningEventLogRepoRef.current = new LearningEventRepository(persistence)
    }
    if (!deckRepoRef.current){
        deckRepoRef.current = new DeckRepository(new LocalStorageDeckPersistence())
    }
    return (
        <RepositoryContext.Provider value={{
            problem: problemRepoRef.current,
            learningEvent: learningEventLogRepoRef.current,
            deck: deckRepoRef.current
        }}>
            {children}
        </RepositoryContext.Provider>
    )

}
    */
export function useRepositoryContext() {
    const ctx = useContext(RepositoryContext)
    if (!ctx) throw new Error("context provider error");
    return ctx;
}
