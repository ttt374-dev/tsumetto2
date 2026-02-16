import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useEffect, useState } from "react";
import { useProblemStore } from "@/application/store/useProblemStore";
import ProblemDetailDialog from "./ProblemDetailDialog";
import { useNavigate } from "react-router-dom";


export function useProblemDetailDialog(
    //onViewProblem: (id: ProblemId) => void,
    //onUpdateProblem: (problem: Problem) => void,
    onAfterDeleteProblem?: () => void,
){
    const [ open, setOpen] = useState(false)
    const [problemId, setProblemId] = useState<ProblemId|undefined>(undefined)
    //const updateProblem = useProblemStore(s=>s.updateProblem)
    const deleteProblems = useProblemStore(s=>s.deleteProblems)

    const navigate = useNavigate()
   
    useEffect(() => {
        useProblemStore.getState().reload()
    }, [open])

    const openDialog = (id: ProblemId) => { 
        setOpen(true);
        setProblemId(id)     
     }
    const closeDialog = () => { setOpen(false)}
    // delete
    const deleteProblem = async () => {
        if (!problemId) return
        await deleteProblems([problemId])
        onAfterDeleteProblem?.()
    }
    const handleViewProblem = () => {        
        problemId && navigate(`/view/${problemId}`)
    }

    const dialogElement = (
        problemId && open &&
        <ProblemDetailDialog    
            open={open}
            problemId={problemId}
            onConfirm={alert}
            onClose={closeDialog}
            onDelete={deleteProblem}
            onResetLearning={alert}  // TODO
            //onUpdateProblem={updateProblem}
            onViewProblem={handleViewProblem}
        />
    )

    return { openDialog, dialogElement }
}