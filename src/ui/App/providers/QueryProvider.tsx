import { useQuery } from "@/application/useQuery"
import type { ReactNode } from "react"
import { createContext, useContext } from "react"

// context を作る
type QueryContextValue = ReturnType<typeof useQuery>
export const QueryContext = createContext<QueryContextValue | null > (null)

export const QueryProvider = ({children}: { children: ReactNode}) => {
    return (
        <QueryContext.Provider value={
            useQuery()  
        }>
            {children}
        </QueryContext.Provider>        
    )
}

// Hook で安全に取得
export function useQueryContext(): QueryContextValue {
  const ctx = useContext(QueryContext)
  if (!ctx) throw new Error("context provider error");
  return ctx;
}



