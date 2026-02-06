import { useRepositoryContext } from "@/ui/App/providers/RepositoryProvider"
import { useState } from "react"
import { useImportFilePicker } from "./useImportFilePicker"
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase"
import { ImportDialog } from "@/ui/common/ImportDialog"
import { useProblemDetailDialog } from "@/ui/common/useProblemDetailDialog"
import { useProblemStore } from "./store/useProblemStore"

export type ImportOptions = {
    tags: string[]
    duplicateStrategy: "skip" | "rename" | "overwrite"
}

export function useImportController(
    onAfterImported?: (files: File[]) => void
) {
    const repos = useRepositoryContext()

    const [files, setFiles] = useState<File[] | null>(null)
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState<ImportOptions>({
        tags: [], duplicateStrategy: "rename"
    })
    const [importing, setImporting] = useState(false)
    const store = useProblemStore(repos.problem)
    const allTags = store.allTags

    const onPicked = (files: File[]) => {
        setFiles(files)
        setOpen(true)
    }

    const picker = useImportFilePicker(onPicked)

    const cancel = () => {
        setOpen(false)
        setFiles(null)
        setOptions({ tags: [], duplicateStrategy: "rename" })
    }

    const confirm = async (options: ImportOptions) => {
        //console.log("confirm", options)
        if (!files) return
        try {
            setImporting(true)
            const usecase = createImportProblemsUsecase(repos.problem)
            await usecase.importFiles(files, options)
            onAfterImported?.(files)
        } finally {
            setImporting(false)
            cancel()
        }
    }
    const dialogElement = (
        open &&
        <ImportDialog
            open={open}
            onImport={confirm}
            allTags={allTags}
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
