import { useMemo, useState } from "react"

import type { ProblemId } from "@/domain/problem/entity/Problem"
import { useLibraryCheckbox } from "@/ui/screens/library/hooks/useLibraryCheckbox"

// -----------------------------
// 選択管理
// -----------------------------    
export function useLibrarySelection(ids: ProblemId[]){
    const [isSelecting, setIsSelecting] = useState(false)

    const startSelection = () => { setIsSelecting(true)}
    const endSelection = () => { setIsSelecting(false)}
    const action = { isSelecting, startSelection, endSelection}
    
    const checkboxControl = useLibraryCheckbox(ids)
    const selection = useMemo(() => ({
        checkedIds: checkboxControl.checkedIds,
        isChecked: checkboxControl.isChecked,
        
    }), [checkboxControl.checkedIds, checkboxControl.isChecked])

    const actions = useMemo(()=>({
        selectAll: checkboxControl.checkAll,
        clearAll: checkboxControl.uncheckAll,
        toggleChecked: checkboxControl.toggleChecked,        
    }), [checkboxControl.checkAll, checkboxControl.uncheckAll, checkboxControl.toggleChecked])
    return  {...action, ...selection, ...actions}
}
