import type { Problem, ProblemId } from "@/domain/problem/entity/Problem";
import { useEffect, useState } from "react";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useNavigate } from "react-router-dom";
import ProblemDetailDialog from "./ProblemDetailDialog";


export function useProblemDetailDialog(
    onAfterDeleteProblem?: ()=>void
){
    const [ open, setOpen] = useState(false)
    const [problemId, setProblemId] = useState<ProblemId|undefined>(undefined)    
   
    //useEffect(() => {
    //    useProblemStore.getState().reload()
    //}, [open])

    const openDialog = (id: ProblemId) => { 
        setOpen(true);
        setProblemId(id)     
     }
    const closeDialog = () => { setOpen(false)}    

    const dialogElement = (
        problemId && 
        <ProblemDetailDialog
            open={open}
            problemId={problemId}
            onClose={closeDialog}
            onAfterDeleteProblem={onAfterDeleteProblem}
        />
    )

    return { openDialog, dialogElement }
}