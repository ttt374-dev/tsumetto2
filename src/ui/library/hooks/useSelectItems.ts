import type { ProblemId } from "@/domain/problem/Problem"
import { useCallback, useState } from "react"

type ItemId = ProblemId

export function useSelectItems<ItemId extends string | number>(initialItems: ItemId[] = []) {
    const [selectedIds, setSelectedIds] = useState<Set<ItemId>>(new Set())

    // query
    const isSelected = useCallback((id: ItemId) => selectedIds.has(id), [selectedIds])
    const isAllSelected = useCallback(()=> initialItems.every(id => isSelected(id)), [initialItems])

    // command
    const toggle = useCallback((id: ItemId) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }, [])

    const selectAll = useCallback(() => setSelectedIds(new Set(initialItems)), [initialItems])
    const clearAll = useCallback(() => setSelectedIds(new Set()), [])
    


    return { selectedIds, isSelected,  isAllSelected, 
        
        toggle, selectAll, clearAll, }
}
