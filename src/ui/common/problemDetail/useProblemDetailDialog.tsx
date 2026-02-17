import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useEffect, useState } from "react";
import { useProblemStore } from "@/application/store/useProblemStore";
import ProblemDetailDialog from "./ProblemDetailDialog";
import { useNavigate } from "react-router-dom";


export function useProblemDetailDialog(){
    const [ open, setOpen] = useState(false)
    const [problemId, setProblemId] = useState<ProblemId|undefined>(undefined)
    const navigate = useNavigate()
   
    useEffect(() => {
        useProblemStore.getState().reload()
    }, [open])

    const openDialog = (id: ProblemId) => { 
        setOpen(true);
        setProblemId(id)     
     }
    const closeDialog = () => { setOpen(false)}
    const handleViewProblem = () => {        
        problemId && navigate(`/view/${problemId}`)
    }

    const dialogElement = (
        problemId && open &&
        <ProblemDetailDialog    
            open={open}
            problemId={problemId}
            onClose={closeDialog}
            onViewProblem={handleViewProblem}
        />
    )

    return { openDialog, dialogElement }
}