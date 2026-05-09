import React, { useState, type ReactNode } from "react"

import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useImportProblemsUsecase, type ImportFilesResult, type ImportOptions } from "@/application/usecase/problem/import/ImportProblemsUsecase"
import { useFileSelector } from "@/ui/shared/hooks/useFileSelector"
import { useDialogState } from "@/ui/common/hooks/useDialogState"

export type ImportController = {
    // state
    open: boolean
    files: File[] | null
    importing: boolean
    result: ImportFilesResult | null    

    // actions
    confirm: (options: ImportOptions) => Promise<void>
    cancel: () => void

    openFilesSelectDialog: () => void

    // elements
    filesSelectElement: React.ReactNode
    
}

export function useImportController(): ImportController {
    const dialog = useDialogState()
    const repos = useRepositoryContext()
    const [files, setFiles] = useState<File[] | null>(null)
    //const [open, setOpen] = useState(false)
    const [importing, setImporting] = useState(false)
    const [result, setResult] = useState<ImportFilesResult | null>(null)
 
    const onFilesSelected = (files: File[]) => {
        setFiles(files)
        //setOpen(true)
        dialog.openDialog()
    }

    const picker = useFileSelector(onFilesSelected)

    const cancel = () => {
        //setOpen(false)        
        setFiles(null)
        dialog.closeDialog()
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
        open: dialog.open,
        files,
        importing,
        result,

        confirm,
        cancel,
        
    }
}
