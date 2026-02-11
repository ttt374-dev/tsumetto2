import AddIcon from "@mui/icons-material/Add"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BackupIcon from "@mui/icons-material/Backup";

import { LibraryView } from "./components/LibraryView";
import { useToast } from "../App/providers/ToastProvider";
import { useLibraryCheckbox } from "./hooks/useLibraryCheckbox";
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useMemo, useState } from "react";
import { AppLayout } from "../common/layout/AppLayout";
import { Fab, IconButton } from "@mui/material";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useViewerDialog } from "../viewer/ViewDialog";
import { useMultipleProblemsTagEditDialog } from "../common/dialogs/MultipleProblemsTagEditDialog";
import { useImportController } from "@/application/useImportControler";
import type { ImportFilesResult, ImportResult } from "@/usecase/importProblemsUsecase";
import BackupRestoreDialog, { useBackupRestoreDialog } from "../common/dialogs/BackupRestoreDialog";
import { useStores } from "@/application/store/useStores";
import { useLearningRecord } from "@/application/useLearningRecord";
import { useProblemDetailDialog } from "../common/problemDetail/useProblemDetailDialog";

//////////////////////////////////////////////////
// LibraryScreen.tsx

export function LibraryScreen() {
    const [checkboxMode, setCheckboxMode] = useState(false)

    //const repos = useRepositoryContext()
    const stores = useStores()    
    const learningRecords = useLearningRecord(stores.learningEvent.eventLog)
    //const problemStore = stores.problem
    const problems = stores.problem.problems
    //const learningRecords = stores.learningEvent.records
    const query = useLibraryQueryContext()
    const viewerDialog = useViewerDialog()
    const detailDialog = useProblemDetailDialog(
        (id: ProblemId) => { viewerDialog.openDialog(id) },
        async (p: Problem) => {
            await stores.problem.update(p)
        }, async () => { await stores.problem.reload() }
    ) // TODO
    const backupRestoreDialog = useBackupRestoreDialog((res) => { 
        if (res.ok) stores.problem.reload()})
    const handleUpdateProblems = async (problems: Problem[]) => {
        for (const p of problems) {
            await stores.problem.update(p)
        }    
    }

    const tagEditDialog = useMultipleProblemsTagEditDialog(handleUpdateProblems)

    const libraryItems = useMemo(() => 
        applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, stores.learningEvent.eventLog, query.sortState, query.filterState]
    )

    const checkboxControl = useLibraryCheckbox(libraryItems.map(p => p.id))
    const toast = useToast()
    //const navigate = useNavigate()
    //const importer = useImportFilePicker((files: File[]) => { problemStore.reload() })
    const importer = useImportController(async (res: ImportFilesResult) => {
        await stores.problem.reload()
        toast({message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`})        
     })

    const handlers = {
        //view: { onViewProblem: (id: string) => navigate(`/view/${id}`) },
        view: { onViewProblem: (id: string) => { detailDialog.openDialog(id)}},
        edit: { 
            onEditTags: (ids: ProblemId[]) => { tagEditDialog.openDialog(ids)},
            onToggleStar: async (p: Problem) => { 
                await stores.problem.update(p.toggleStar())

            },
        },
        import: {
            onOpenImportFileDialog: importer.openFileDialog,
        },
        delete: {
            onDeleteAll: async () => {
                if (!window.confirm("Are you sure to delete all?")) return
                await stores.problem.deleteAll()
                await stores.learningEvent.deleteAll()
                toast({ message: "Deleted all problems" })
            },
            onDeleteChecked: async () => {
                if (!window.confirm("Are you sure to delete selected?")) return
                const ids = Array.from(checkboxControl.checkedIds)
                await stores.problem.deleteProblems(ids)
                toast({ message: `Deleted ${ids.length} problems` })
            }
        },
        checkbox: {
            onCheckAll: checkboxControl.checkAll,
            onUncheckAll: checkboxControl.uncheckAll,
            onToggleChecked: checkboxControl.toggleChecked,
            onToggleCheckboxMode: () => {
                setCheckboxMode(prev => !prev)
                checkboxControl.uncheckAll()
            }
        }
    }

    const selection = {
        checkedIds: checkboxControl.checkedIds,
        isChecked: checkboxControl.isChecked,
        isCheckboxMode: checkboxMode
    }
    
    return (

        <AppLayout
            header="Library"
            rightActions={
                <>
                    <IconButton onClick={backupRestoreDialog.openDialog}>
                        <BackupIcon sx={{ color: "#fff" }} />
                    </IconButton>
                    <IconButton onClick={handlers.import.onOpenImportFileDialog}>
                        <AddOutlinedIcon sx={{ color: "#fff" }} />
                    </IconButton>
                </>
            }
        >
            <LibraryView
                problems={libraryItems}
                learningRecords={learningRecords}
                query={query}
                handlers={handlers}
                selection={selection}
            />
            { /* ダイアログ */}
            {importer.pickerElement}
            {importer.dialogElement}
            {viewerDialog.dialogElement}
            {detailDialog.dialogElement}
            {tagEditDialog.dialogElement}
            {backupRestoreDialog.dialogElement}
        </AppLayout>
    )
}
