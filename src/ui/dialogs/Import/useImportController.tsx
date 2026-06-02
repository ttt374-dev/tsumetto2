import React, { useState, type ReactNode } from "react"

import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useImportProblemsUsecase, type ImportFilesResult, type ImportOptions } from "@/application/usecase/problem/import/ImportProblemsUsecase"
import { useFileSelector } from "@/shared/hooks/useFileSelector"
import { useDialogState } from "@/ui/common/hooks/useDialogState"
import { useProblemStore } from "@/ui/features/problem/hooks/useProblemStore"

export type ImportController = {
    // state
    open: boolean
    files: File[] | null
    //importing: boolean
    result: ImportFilesResult | null    

    // actions
    confirm: (options: ImportOptions) => Promise<ImportFilesResult>
    cancel: () => void

    openFilesSelectDialog: () => void

    // elements
    filesSelectElement: React.ReactNode
    
}

export function useImportController(): ImportController {
    const dialog = useDialogState()
    const repos = useRepositoryContext()
    const [files, setFiles] = useState<File[]>([])
    //const [importing, setImporting] = useState(false)
    const [result, setResult] = useState<ImportFilesResult | null>(null)
    const reloadStore = useProblemStore(s=>s.reload)
    const usecase = useImportProblemsUsecase(repos.problem) 

    const onFilesSelected = (files: File[]) => {
        setFiles(files)
        dialog.openDialog()
    }

    const picker = useFileSelector(onFilesSelected)

    const cancel = () => {
        setFiles([])
        dialog.closeDialog()
    }

    const confirm = async (options: ImportOptions) => {
        //if (!files) return
        
        //    setImporting(true)
        const result = await usecase.importFiles(files, options)
        setResult(result) // ← ここ
        await reloadStore()        
        return result
        //console.log("confirm reloaded")
        
        //} finally {
        //    setImporting(false)
        //    cancel()
        //}
    }

    return {
        // picker
        openFilesSelectDialog: picker.openDialog,
        filesSelectElement: picker.inputElement,

        // dialog
        open: dialog.open,
        files,
        //importing,
        result,

        confirm,
        cancel,
        
    }
}
