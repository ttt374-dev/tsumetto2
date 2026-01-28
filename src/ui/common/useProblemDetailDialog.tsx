import type { Problem } from "@/domain/problem/Problem";
import { useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import ProblemDetailDialog from "./ProblemDetailDialog";

export function useProblemDetailDialog(problem: Problem){
    const [ open, setOpen] = useState(false)

    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)

    const openDialog = () => { setOpen(true); console.log("detaildialog", open); }
    const closeDialog = () => { setOpen(false)}
    // delete
    const deleteProblem = async () => {
        await repos.problem.remove(problem.id)
        await problemStore.reload()
        //next()
    }

    const dialogElement = (
        <ProblemDetailDialog    
            open={open}
            problem={problem}
            onConfirm={alert}
            onClose={closeDialog}
            onDelete={deleteProblem}
            onResetLearning={alert}  // TODO
        />
    )

    return { openDialog, dialogElement }
}