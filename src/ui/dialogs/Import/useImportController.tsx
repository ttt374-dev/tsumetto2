import { useState } from "react"

import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useImportProblemsUsecase, type ImportFilesResult, type ImportOptions } from "@/application/usecase/problem/import/ImportProblemsUsecase"
import { ImportDialog } from "./ImportDialog"
import { useFileSelector } from "@/ui/shared/hooks/useFileSelector"

export function useImportController(onAfterImported?: (result: ImportFilesResult) => void){
    const repos = useRepositoryContext()
    const [files, setFiles] = useState<File[] | null>(null)
    const [open, setOpen] = useState(false)
    const [importing, setImporting] = useState(false)
    const [result, setResult] = useState<ImportFilesResult | null>(null)
 
    const onFilesSelected = (files: File[]) => {
        setFiles(files)
        setOpen(true)
    }

    const picker = useFileSelector(onFilesSelected)

    const cancel = () => {
        setOpen(false)
        setFiles(null)
    }

    const confirm = async (options: ImportOptions) => {
        if (!files) return
        try {
            setImporting(true)
            const usecase = useImportProblemsUsecase(repos.problem)
            const result = await usecase.importFiles(files, options)
            //onAfterImported?.(result)
            setResult(result) // ← ここ
        } finally {
            setImporting(false)
            cancel()
        }
    }

    return {
        // picker
        openFilesSelectDialog: picker.openDialog,
        filesSelectElement: picker.inputElement,

        // dialog
        open,
        files,
        importing,
        result,

        confirm,
        cancel,
        
    }
}
