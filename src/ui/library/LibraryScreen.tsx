import { useLibraryController } from "./hooks/useLibraryController";
import { LibraryView } from "./components/LibraryView";
import { useToast } from "../App/providers/ToastProvider";
import { useNavigate } from "react-router-dom";



//////////////////////////////////////////////////

// LibraryScreen.tsx
export function LibraryScreen() {
  const ctrl = useLibraryController()
  const toast = useToast()
  const navigate = useNavigate()

  const handleImportFiles = (files: File[]) => {
    ctrl.importFiles(files)
    toast({ message: `imported ${files.length} files` })
  }

  return (
    <LibraryView
      items={ctrl.items}
      query={ctrl.query}
      onImportFiles={handleImportFiles}
      onDeleteAll={ctrl.handleDeleteAll}
      onSelect={e => navigate(`/view/${e.problem.id}`)}
    />
  )
}
