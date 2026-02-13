import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BackupIcon from "@mui/icons-material/Backup";

import { LibraryView } from "./components/LibraryView";
import { useToast } from "../App/providers/ToastProvider";
import { useLibraryCheckbox } from "./hooks/useLibraryCheckbox";
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useImportController } from "@/application/useImportControler";
import type { ImportFilesResult } from "@/usecase/importProblemsUsecase";
import { useStores } from "@/application/store/useStores";
import { useLearningRecord } from "@/application/useLearningRecord";
import type { useQuery } from "@/application/useQuery";
import type { LearningRecord } from "@/domain/learning/Learning";
import { AppShell } from "../common/layout/AppShell";
import { useSelectItems } from "./hooks/useSelectItems";
import { useLibraryController } from "./hooks/useLibraryController";
import { useLibraryPresenter } from "./hooks/useLibraryPresenter";

function useLibraryItems(problems: Problem[], learningRecords: LearningRecord, query: ReturnType<typeof useQuery>){
    return useMemo(() =>
        applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, learningRecords, query.sortState, query.filterState]
    )    
}

//////////////////////////////////////////////////
export function LibraryScreen() {
    const stores = useStores()
    const learningRecords = useLearningRecord(stores.learningEvent.eventLog)
    const query = useLibraryQueryContext()
    const controller = useLibraryController(stores.problem)

    const [checkboxMode, setCheckboxMode] = useState(false)
    const presenter = useLibraryPresenter(controller)

    const libraryItems = useLibraryItems(stores.problem.problems, learningRecords, query)
    const checkboxControl = useLibraryCheckbox(libraryItems.map(p => p.id))
    const toast = useToast()
    const selectionController = useSelectItems(libraryItems.map(p=>p.id))

    // importer
    const importer = useImportController(async (res: ImportFilesResult) => {
        await controller.reload()
        toast({ message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}` })
    })
    
    
    const handlers = {
        view: { onViewProblem: (p: Problem) => { presenter.dialogs.detail.openDialog(p) } },
        edit: {
            onEditTags: (ids: ProblemId[]) => { presenter.dialogs.tagEdit.openDialog(ids) },
        },
        import: {
            onOpenImportFileDialog: importer.openFileDialog,
        },
        delete: {
            onDeleteMany: async (ids: ProblemId[]) => {
                if (!window.confirm("Are you sure to delete selected?")) return
                //const ids = Array.from(checkboxControl.checkedIds)
                const res = await controller.deleteMany(ids)
                toast({ message: `Deleted ${res} problems` })
            },
        },
        checkbox: {
            onCheckAll: checkboxControl.checkAll,
            onUncheckAll: checkboxControl.uncheckAll,
            onToggleChecked: checkboxControl.toggleChecked,
            
        },
        mode: {
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
