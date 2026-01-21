import { useFileSelector } from "../sharedComponents/useFileSelector";
import { useLibraryController } from "./hooks/useLibraryController";
import { LibraryView } from "./components/LibraryView";
import { useExerciseControl } from "@/application/useExerciseControl";
import { useToast } from "../App/providers/ToastProvider";
import { useNavigate } from "react-router-dom";



//////////////////////////////////////////////////

// LibraryScreen.tsx
export function LibraryScreen() {
  const c = useLibraryController()
  const toast = useToast()
  const exerciseControl = useExerciseControl()
  const { openFileDialog, inputElement, setOnFilesSelected } =
    useFileSelector(".kif")
  const navigate = useNavigate()

  setOnFilesSelected(files => {
    exerciseControl.importFiles(Array.from(files))
    toast({ message: "imported" })    
  })

  return (
    <>
      <LibraryView
        items={c.items}
        query={c.query}
        onImport={openFileDialog}
        onDeleteAll={c.handleDeleteAll}
        onSelect={e => navigate(`/view/${e.problem.id}`)}
      />
      {inputElement}
    </>
  )
}
