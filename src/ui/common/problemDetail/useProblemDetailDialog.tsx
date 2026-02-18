import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useEffect, useState } from "react";
import { useProblemStore } from "@/application/store/useProblemStore";
import ProblemDetailDialog from "./ProblemDetailDialog";
import { useNavigate } from "react-router-dom";


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
        problemId && open &&
        <ProblemDetailDialog    
            open={open}
            problemId={problemId}
            onClose={closeDialog}
            onAfterDeleteProblem={onAfterDeleteProblem}
        />
    )

    return { openDialog, dialogElement }
}