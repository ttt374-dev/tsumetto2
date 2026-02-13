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
import { IconButton } from "@mui/material";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useViewerDialog } from "../viewer/ViewDialog";
import { useMultipleProblemsTagEditDialog } from "../common/dialogs/MultipleProblemsTagEditDialog";
import { useImportController } from "@/application/useImportControler";
import type { ImportFilesResult } from "@/usecase/importProblemsUsecase";
import { useBackupRestoreDialog } from "../common/dialogs/BackupRestoreDialog";
import { useStores } from "@/application/store/useStores";
import { useLearningRecord } from "@/application/useLearningRecord";
import { useProblemDetailDialog } from "../common/problemDetail/useProblemDetailDialog";
import type { useQuery } from "@/application/useQuery";
import type { LearningRecord } from "@/domain/learning/Learning";
import { AppShell } from "../common/layout/AppShell";

function useLibraryItems(problems: Problem[], learningRecords: LearningRecord, query: ReturnType<typeof useQuery>){
    return useMemo(() =>
        applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, learningRecords, query.sortState, query.filterState]
    )    
}

function useLibraryController(stores: ReturnType<typeof useStores>) {
    // command
    const reload = async () => {
        await stores.problem.reload()
    }
    const deleteAll = async () => {
        await stores.problem.deleteAll()
        await stores.learningEvent.deleteAll()        
    }
    const deleteMany = async (ids: ProblemId[]) => {        
        await stores.problem.deleteProblems(ids)   
        return ids.length     
    }
    const toggleStar = async (p: Problem) => {
        await stores.problem.updateProblem(p.toggleStar())

    }
    const updateProblem = async (p: Problem) => {
        await stores.problem.updateProblem(p)
    }
    return {
        //libraryItems,
        reload,
        deleteAll, deleteMany,
        toggleStar, updateProblem,
    }
}
function useLibraryPresenter (controller: ReturnType<typeof useLibraryController>){
     // dialogs
    const viewerDialog = useViewerDialog()
    const backupRestoreDialog = useBackupRestoreDialog((res) => {
        if (res.ok) controller.reload()
    })
    const detailDialog = useProblemDetailDialog(
        (id: ProblemId) => { viewerDialog.openDialog(id) },
        async (p: Problem) => {
            await controller.updateProblem(p)
        }, async () => { await controller.reload() }
    )
    const handleUpdateProblems = async (problems: Problem[]) => {
        for (const p of problems) {
            await controller.updateProblem(p)
        }
    }
    const tagEditDialog = useMultipleProblemsTagEditDialog(handleUpdateProblems)
    const dialogs = {
        viewer: viewerDialog,
        detail: detailDialog,
        backupRestore: backupRestoreDialog,
        tagEdit: tagEditDialog,
    }
    return { dialogs }
}
//////////////////////////////////////////////////
export function LibraryScreen() {
    const stores = useStores()
    const learningRecords = useLearningRecord(stores.learningEvent.eventLog)
    const query = useLibraryQueryContext()
    const controller = useLibraryController(stores)

    const [checkboxMode, setCheckboxMode] = useState(false)
    const presenter = useLibraryPresenter(controller)

    const libraryItems = useLibraryItems(stores.problem.problems, learningRecords, query)
    const checkboxControl = useLibraryCheckbox(libraryItems.map(p => p.id))
    const toast = useToast()

    // importer
    const importer = useImportController(async (res: ImportFilesResult) => {
        await controller.reload()
        toast({ message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}` })
    })
    
    
    const handlers = {
        view: { onViewProblem: (p: Problem) => { presenter.dialogs.detail.openDialog(p) } },
        edit: {
            onEditTags: (ids: ProblemId[]) => { presenter.dialogs.tagEdit.openDialog(ids) },
            onToggleStar: controller.toggleStar,
        },
        import: {
            onOpenImportFileDialog: importer.openFileDialog,
        },
        delete: {
            onDeleteAll: async () => {
                if (!window.confirm("Are you sure to delete all?")) return
                await controller.deleteAll()
                toast({ message: "Deleted all problems" })
            } ,
            onDeleteChecked: async () => {
                if (!window.confirm("Are you sure to delete selected?")) return
                const ids = Array.from(checkboxControl.checkedIds)
                const res = await controller.deleteMany(ids)
                toast({ message: `Deleted ${res} problems` })
            },
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
        <AppShell
            header="Library"
            rightActions={
                <>
                    <IconButton onClick={presenter.dialogs.backupRestore.openDialog}>
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
            {presenter.dialogs.viewer.dialogElement}
            {presenter.dialogs.detail.dialogElement}
            {presenter.dialogs.tagEdit.dialogElement}
            {presenter.dialogs.backupRestore.dialogElement}
        </AppShell>
    )
}
