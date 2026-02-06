import AddIcon from "@mui/icons-material/Add"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BackupIcon from "@mui/icons-material/Backup";

import { LibraryView } from "./components/LibraryView";
import { useToast } from "../App/providers/ToastProvider";
import { useLibraryCheckbox } from "./hooks/useLibraryCheckbox";
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useMemo, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { AppLayout } from "../common/AppLayout";
import { Fab, IconButton } from "@mui/material";
import { useProblemDetailDialog } from "../common/useProblemDetailDialog";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useViewerDialog } from "../viewer/ViewDialog";
import { useMultipleProblemsTagEditDialog } from "../common/MultipleProblemsTagEditDialog";
import { useImportController } from "@/application/useImportControler";
import type { ImportFilesResult, ImportResult } from "@/usecase/importProblemsUsecase";
import BackupRestoreDialog, { useBackupRestoreDialog } from "../common/BackupRestoreDialog";

//////////////////////////////////////////////////
// LibraryScreen.tsx

export function LibraryScreen() {
    const [checkboxMode, setCheckboxMode] = useState(false)
    
    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)
    const problems = problemStore.problems
    const learningRecords = useLearningEventStore(repos.learningEvent).records
    const query = useLibraryQueryContext()
    const viewerDialog = useViewerDialog()
    const detailDialog = useProblemDetailDialog(
        (id: ProblemId) => { viewerDialog.openDialog(id)},
        async (p: Problem)=>{
        await repos.problem.update(p)
        await problemStore.reload()
    }) // TODO
    const backupRestoreDialog = useBackupRestoreDialog((res) => { 
        if (res.ok) problemStore.reload()})
    const handleUpdateProblems = async (problems: Problem[]) => {
        for (const p of problems) {
            await repos.problem.update(p)
        }
        await problemStore.reload()        
    }

    const tagEditDialog = useMultipleProblemsTagEditDialog(handleUpdateProblems)

    const libraryItems = useMemo(() => 
        applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, learningRecords, query.sortState, query.filterState]
    )

    const checkboxControl = useLibraryCheckbox(libraryItems.map(p => p.id))
    const toast = useToast()
    //const navigate = useNavigate()
    //const importer = useImportFilePicker((files: File[]) => { problemStore.reload() })
    const importer = useImportController(async (res: ImportFilesResult) => {
        await problemStore.reload()
        toast({message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`})        
     })

    const handlers = {
        //view: { onViewProblem: (id: string) => navigate(`/view/${id}`) },
        view: { onViewProblem: (id: string) => { detailDialog.openDialog(id)}},
        edit: { 
            onEditTags: (ids: ProblemId[]) => { tagEditDialog.openDialog(ids)},
            onToggleStar: async (p: Problem) => { 
                await repos.problem.update(p.toggleStar())
                await problemStore.reload()

            },
        },
        import: {
            onOpenImportFileDialog: importer.openFileDialog,
        },
        delete: {
            onDeleteAll: async () => {
                if (!window.confirm("Are you sure to delete all?")) return
                await repos.problem.removeAll()
                await repos.learningEvent.removeAll()
                problemStore.reload()
                toast({ message: "Deleted all problems" })
            },
            onDeleteChecked: async () => {
                if (!window.confirm("Are you sure to delete selected?")) return
                const ids = Array.from(checkboxControl.checkedIds)
                await repos.problem.removeMany(ids)
                problemStore.reload()
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
        <>
            <AppLayout
                header="Library"
                rightActions={
                    <>
                        <IconButton onClick={backupRestoreDialog.openDialog}>
                            <BackupIcon  sx={{ color: "#fff" }}/>
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
            </AppLayout>

            { /* ダイアログ */}
            {importer.pickerElement}
            {importer.dialogElement}
            {viewerDialog.dialogElement}
            {detailDialog.dialogElement}
            {tagEditDialog.dialogElement}
            {backupRestoreDialog.dialogElement}
        </>
    )
}
