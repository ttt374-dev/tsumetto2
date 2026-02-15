import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useEffect, useState } from "react";
import { useProblemStore } from "@/application/store/useProblemStore";
import ProblemDetailDialog from "./ProblemDetailDialog";
import { useNavigate } from "react-router-dom";
import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider";
import { useViewerDialog } from "@/ui/viewer/ViewDialog";


export function useProblemDetailDialog(
    //onViewProblem: (id: ProblemId) => void,
    onUpdateProblem: (problem: Problem) => void,
    onAfterDeleteProblem?: () => void,
){
    const [ open, setOpen] = useState(false)
    const [problem, setProblem] = useState<Problem|undefined>(undefined)

    const repos = useRepositoryContext()
    //const store = useProblemStore(repos.problem)
    //const viewDialog = useViewerDialog()
    //const problem = problemId && problemStore.findById(problemId)
    const navigate = useNavigate()
   
    useEffect(() => {
        useProblemStore.getState().reload()
    }, [open])

    const openDialog = (p: Problem) => { 
        setOpen(true);
        setProblem(p)
        console.log("open detail dialog", p)

     }
    const closeDialog = () => { setOpen(false)}
    // delete
    const deleteProblem = async () => {
        if (!problem) return
        await repos.problem.remove(problem.id)
        onAfterDeleteProblem?.()
        //await store.reload()
    }
    const handleViewProblem = () => {        
        //problem && onViewProblem(problem.id)
        problem && navigate(`/view/${problem.id}`)

        //closeDialog()
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
            onUpdateProblem={onUpdateProblem}
            onViewProblem={handleViewProblem}
        />
    )

    return { openDialog, dialogElement }
}