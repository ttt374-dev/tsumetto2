import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useState } from "react"
import { useImportFilePicker } from "./useImportFilePicker"
import { useImportProblemsUsecase, type ImportFilesResult, type ImportResult } from "@/application/usecase/importProblemsUsecase"
import { ImportDialog } from "@/ui/common/dialogs/Import/ImportDialog"

export type DuplicateTitleStrategy = "skip" | "rename" | "overwrite"
export type ImportOptions = {
    tags: string[]
    duplicateTitleStrategy: DuplicateTitleStrategy
}

export function useImportController(
    onAfterImported?: (result: ImportFilesResult) => void
) {
    const repos = useRepositoryContext()

    const [files, setFiles] = useState<File[] | null>(null)
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<ImportOptions>({
        tags: [], duplicateTitleStrategy: "rename"
    })
    const [importing, setImporting] = useState(false)

    const onPicked = (files: File[]) => {
        setFiles(files)
        setOpen(true)
    }

    const picker = useImportFilePicker(onPicked)

    const cancel = () => {
        setOpen(false)
        setFiles(null)
        setOptions({ tags: [], duplicateTitleStrategy: "rename" })
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
        <ImportDialog
            open={open}
            onClose={cancel}
            onImport={confirm}
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
