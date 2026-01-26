import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useFileSelector } from "@/ui/sharedComponents/useFileSelector"
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase"

export function useImporter(onAfterImported?: (files: File[]) => void){
    const { openFileDialog, inputElement, setOnFilesSelected } = useFileSelector(".kif")    
    const repos = useRepositoryContext()

    setOnFilesSelected(async fileList => {
        const files = Array.from(fileList)
        if (!window.confirm(`importing ${files.length} files`)) return
        const importer = createImportProblemsUsecase(repos.problem)
        await importer.importFiles(files)
        onAfterImported?.(files)
        //await dashboard.reloadStores()
        //toast({message: `imported ${files.length} file`})
    })
    return { openFileDialog, inputElement }
}