import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useEffect, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import ProblemDetailDialog from "./ProblemDetailDialog";
import { useNavigate } from "react-router-dom";
import { useViewerDialog } from "../viewer/ViewDialog";

export function useProblemDetailDialog(
    onViewProblem: (id: ProblemId) => void,
    onUpdateProblem: (problem: Problem) => void){
    const [ open, setOpen] = useState(false)
    const [problem, setProblem] = useState<Problem|undefined>(undefined)

    const repos = useRepositoryContext()
    const store = useProblemStore(repos.problem)
    const navigate =useNavigate()
    const viewDialog = useViewerDialog()
    //const problem = problemId && problemStore.findById(problemId)
   
        useEffect(()=> {
            store.reload()
        }, [open])

    const openDialog = (problemId: ProblemId) => { 
        setOpen(true);         
        const next = store.findById(problemId)
        setProblem(next)
        console.log("open detail dialog", next)

     }
    const closeDialog = () => { setOpen(false)}
    // delete
    const deleteProblem = async () => {
        if (!problem) return
        await repos.problem.remove(problem.id)
        await store.reload()
    }
    const handleViewProblem = () => {
        
        problem && onViewProblem(problem.id)
        //closeDialog()
    }

    const dialogElement = (
        problem && open &&
        <ProblemDetailDialog    
            open={open}
            problemId={problem.id}
            onConfirm={alert}
            onClose={closeDialog}
            onDelete={deleteProblem}
            onResetLearning={alert}  // TODO
            onUpdateProblem={onUpdateProblem}
            onViewProblem={handleViewProblem}
        />
    )

    return { openDialog, dialogElement }
}