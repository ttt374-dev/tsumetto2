import { LibraryView } from "./components/LibraryView";
import { useToast } from "../App/providers/ToastProvider";
import { useNavigate } from "react-router-dom";
import { useLibraryCheckbox } from "./hooks/useLibraryCheckbox";
import { useExerciseControl } from "@/application/useExerciseControl";
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";


//////////////////////////////////////////////////
// LibraryScreen.tsx
export function LibraryScreen() {
  const exerciseController = useExerciseControl()  
  const query = useLibraryQueryContext()
  const libraryItems = applyQuery(exerciseController.exerciseList, query.sortState, query.filterState)  
  const checkboxControl = useLibraryCheckbox(libraryItems.map(e=>e.problem.id))
  const toast = useToast()
  const navigate = useNavigate()

  // --- handlers ---
  const handleImportFiles = (files: File[]) => {
    exerciseController.importFiles(files)
    toast({ message: `imported ${files.length} files` })
  }
  const handleDeleteAll = () => {
    if (!window.confirm("are you sure to delete")) return    
    exerciseController.deleteAllProblems
    toast({message: `delete all problems`})
  }
  const handleDeleteChecked = () => {
    if (!window.confirm("are you sure to delete")) return
    const deleteIds = Array.from(checkboxControl.checkedIds)
    exerciseController.deleteMany(deleteIds)    
    toast({message: `delete ${deleteIds.length} problems`})
  }
  return (
    <LibraryView
      items={libraryItems}
      query={query}
      onImportFiles={handleImportFiles}
      onDeleteAll={handleDeleteAll}
      onSelect={e => navigate(`/view/${e.problem.id}`)}

      isChecked={checkboxControl.isChecked}
      checkedIds={checkboxControl.checkedIds}
      onToggleChecked={checkboxControl.toggleChecked}
      onDeleteChecked={handleDeleteChecked}
    />
  )
}
