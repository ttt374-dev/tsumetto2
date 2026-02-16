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
    const [problem, setProblem] = useState<Problem|undefined>(undefined)
    //const updateProblem = useProblemStore(s=>s.updateProblem)
    const deleteProblems = useProblemStore(s=>s.deleteProblems)

    const navigate = useNavigate()
   
    useEffect(() => {
        useProblemStore.getState().reload()
    }, [open])

    const openDialog = (p: Problem) => { 
        setOpen(true);
        setProblem(p)     
     }
    const closeDialog = () => { setOpen(false)}
    // delete
    const deleteProblem = async () => {
        if (!problem) return
        await deleteProblems([problem.id])
        onAfterDeleteProblem?.()
    }
    const handleViewProblem = () => {        
        problem && navigate(`/view/${problem.id}`)
    }

    const dialogElement = (
        problem && open &&
        <ProblemDetailDialog    
            open={open}
            problem={problem}
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