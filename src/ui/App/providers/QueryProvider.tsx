import { useQuery } from "@/ui/common/hooks/useQuery"
import type { ReactNode } from "react"
import { createContext, useContext } from "react"

// context を作る
export type QueryContextValue = ReturnType<typeof useQuery>
export const MissionQueryContext = createContext<QueryContextValue | null > (null)
export const LibraryQueryContext = createContext<QueryContextValue | null > (null)

// mission
export const MissionQueryProvider = ({children}: { children: ReactNode}) => {
    const query = useQuery({filter: { dueForReviewOnly: true}})
    return (
        <MissionQueryContext.Provider value={query}>
            {children}
        </MissionQueryContext.Provider>        
    )
}
export function useMissionQueryContext(): QueryContextValue {
  const ctx = useContext(MissionQueryContext)
  if (!ctx) throw new Error("context provider error");
  return ctx;
}


// library
export const LibraryQueryProvider = ({children}: { children: ReactNode}) => {
    const query = useQuery()
    return (
        <LibraryQueryContext.Provider value={query}>
            {children}
        </LibraryQueryContext.Provider>        
    )
}
export function useLibraryQueryContext(): QueryContextValue {
  const ctx = useContext(LibraryQueryContext)
  if (!ctx) throw new Error("context provider error");
  return ctx;
}
