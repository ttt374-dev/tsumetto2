import { useFileSelector } from "../sharedComponents/useFileSelector";
import { useLibraryController } from "./hooks/useLibraryController";
import { LibraryView } from "./components/LibraryView";



//////////////////////////////////////////////////

// LibraryScreen.tsx
export function LibraryScreen() {
  const c = useLibraryController()
  const { openFileDialog, inputElement, setOnFilesSelected } =
    useFileSelector(".kif")

  setOnFilesSelected(files => {
    c.importFiles(Array.from(files))
  })

  return (
    <>
      <LibraryView
        items={c.items}
        query={c.query}
        onImport={openFileDialog}
        onDeleteAll={c.handleDeleteAll}
        onSelect={e => c.navigate(`/view/${e.problem.id}`)}
      />
      {inputElement}
    </>
  )
}
