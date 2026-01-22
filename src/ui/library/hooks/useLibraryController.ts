import { useExerciseControl } from "@/application/useExerciseControl"
import { applyQuery } from "@/domain/Exercise/query/applyQuery"
import { useLibraryQueryContext } from "../../App/providers/QueryProvider"
import { useRepositoryContext } from "../../App/providers/RepositoryProvider"
import { useToast } from "../../App/providers/ToastProvider"
import { useNavigate } from "react-router-dom"
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase"

// useLibraryController.ts
export function useLibraryController() {
  const { exerciseList, 
    deleteProblem, deleteAllProblems, importFiles } = useExerciseControl()

  const query = useLibraryQueryContext()
  const repos = useRepositoryContext()
  const toast = useToast()


  /* ---------- delete ---------- */
  const handleDeleteAll = async () => {
    if (!window.confirm("ok to delete all ?")) return
    await deleteAllProblems()
    toast({ message: "deleted all" })
  }

  const handleDeleteOne = async (id: string) => {
    if (!window.confirm("ok to delete ?")) return
    await deleteProblem(id)
    toast({ message: "deleted" })
  }

  /* ---------- derived ---------- */
  const items = applyQuery(
    exerciseList,
    query.sortState,
    query.filterState
  )

  return {
    // data
    items,
    query,

    // actions
    handleDeleteAll,
    handleDeleteOne,

    // delegate to exercisecontrol
    importFiles
    
  }
}
