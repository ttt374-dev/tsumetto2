import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useState } from "react"
import { DefaultImportOptions, useImportProblemsUsecase, type ImportFilesResult, type ImportOptions } from "@/application/usecase/problem/import/ImportProblemsUsecase"
import { ImportDialog } from "./ImportDialog"
import { useFileSelector } from "@/ui/shared/hooks/useFileSelector"

export function useImport(onAfterImported?: (result: ImportFilesResult) => void){
    const repos = useRepositoryContext()
    const [files, setFiles] = useState<File[] | null>(null)
    const [open, setOpen] = useState(false)
    //const [options, setOptions] = useState<ImportOptions>({...DefaultImportOptions})
    const [importing, setImporting] = useState(false)
 
    const onFilesSelected = (files: File[]) => {
        setFiles(files)
        setOpen(true)
        //console.log("onpicked", files)
    }

    const picker = useFileSelector(onFilesSelected)

    const cancel = () => {
        setOpen(false)
        setFiles(null)
        //setOptions({...DefaultImportOptions})
    }

    const confirm = async (options: ImportOptions) => {
        if (!files) return
        try {
            setImporting(true)
            const usecase = useImportProblemsUsecase(repos.problem)
            const result = await usecase.importFiles(files, options)
            onAfterImported?.(result)
        } finally {
            setImporting(false)
            cancel()
        }
    }
    
    const dialogElement = (
        open && files &&
        <ImportDialog
            open={open}
            onClose={cancel}
            onImport={confirm}
            filesToImport={files}
        />
    )

    return {
        // picker
        //...picker,
        openFilesSelectDialog: picker.openDialog,
        filesSelectElement: picker.inputElement,


        // dialog
        open,
        files,
        //options,
        //setOptions,
        importing,
        dialogElement,

        // actions
        confirm,
        cancel,
    }
}
