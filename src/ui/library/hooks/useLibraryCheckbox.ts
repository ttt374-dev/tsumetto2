import { useState } from "react"


export function useLibraryCheckbox(problemIds: string[]): {
    checkedIds: Set<string>
    isChecked(id: string): boolean
    toggleChecked: (id: string) => void
    isAllChecked: boolean
    clearAll: () => void
    selectAll: () => void    
} {
    const [ checkedIds, setCheckedIds] = useState<Set<string>>(()=>new Set())

    const isAllChecked = checkedIds.size === Object.keys(problemIds).length
    const isChecked = (id: string) => checkedIds.has(id)
    const toggleChecked = (id: string) => setCheckedIds(prev=>{
        const next = new Set(prev)
        if (next.has(id)) { 
            next.delete(id)
        } else {
            next.add(id)
        }
        return next
    })

    const selectAll = () => setCheckedIds(new Set(problemIds))
    const clearAll = () => setCheckedIds(new Set())

    return {
        checkedIds,        

        isChecked, toggleChecked,
        isAllChecked,
        clearAll, selectAll,

    }
}