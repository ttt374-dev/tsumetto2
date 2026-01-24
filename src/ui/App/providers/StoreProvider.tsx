import type { ReactNode, } from "react"
import { createContext, useContext, } from "react"
import { useRepositoryContext } from "./RepositoryProvider"
import { useProblemStore } from "@/application/store/useProblemStore"
//import { createLearningStore } from "@/application/store/useLearningStore"

/*
type StoreContextValue = {
    readonly problem: ReturnType<typeof createProblemStore>
    //readonly learning: ReturnType<typeof createLearningStore>
}
export const StoreContext = createContext<StoreContextValue | null>(null)

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const repos = useRepositoryContext()
    return (
        <StoreContext.Provider value={{
            problem: createProblemStore(repos.problem),
            //learning: createLearningStore(repos.learning)
        }}>
            {children}
        </StoreContext.Provider>
    )
}

export function useStoreContext() {
    const ctx = useContext(StoreContext)
    if (!ctx) throw new Error("context provider error");
    return ctx;
}
*/