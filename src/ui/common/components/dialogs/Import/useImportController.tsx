import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useEffect, useState } from "react"
import { useImportFilePicker } from "./useImportFilePicker"
import { DefaultImportOptions, useImportProblemsUsecase, type ImportFilesResult, type ImportOptions } from "@/application/usecase/problem/import/ImportProblemsUsecase"
import { ImportDialog } from "./ImportDialog"
import { useProblemStore } from "@/ui/store/useProblemStore"

export function useImportController(
    onAfterImported?: (result: ImportFilesResult) => void
) {
    const repos = useRepositoryContext()
    const [files, setFiles] = useState<File[] | null>(null)
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<ImportOptions>({...DefaultImportOptions})
    const [importing, setImporting] = useState(false)
 
    const onPicked = (files: File[]) => {
        setFiles(files)
        setOpen(true)
        console.log("onpicked", files)
    }

    const picker = useImportFilePicker(onPicked)

    const cancel = () => {
        setOpen(false)
        setFiles(null)
        setOptions({...DefaultImportOptions})
    }

    const confirm = async (options: ImportOptions) => {
        //console.log("confirm", options)
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
        ...picker,

        // dialog
        open,
        files,
        options,
        setOptions,
        importing,
        dialogElement,

        // actions
        confirm,
        cancel,
    }
}
