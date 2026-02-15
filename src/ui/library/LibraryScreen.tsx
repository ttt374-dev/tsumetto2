import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BackupIcon from "@mui/icons-material/Backup";

import { useToast } from "../App/providers/ToastProvider";
import { useLibraryCheckbox } from "./hooks/useLibraryCheckbox";
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useEffect, useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useImportController } from "@/application/useImportControler";
import type { ImportFilesResult } from "@/usecase/importProblemsUsecase";
import { useStores } from "@/application/store/useStores";
import { useLearningRecordStore } from "@/application/useLearningRecordStore";
import type { useQuery } from "@/application/useQuery";
import type { LearningRecord } from "@/domain/learning/Learning";
import { AppShell } from "../common/layout/AppShell";
import { useSelectItems } from "./hooks/useSelectItems";
import { useLibraryController } from "./hooks/useLibraryController";
import { useLibraryPresenter } from "./hooks/useLibraryPresenter";
import { LibraryView } from "./components/LibraryView";
import { useProblemStore } from "@/application/store/useProblemStore";

function useLibraryItems(problems: Problem[], learningRecords: LearningRecord, query: ReturnType<typeof useQuery>){
    return useMemo(() =>
        applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, learningRecords, query.sortState, query.filterState]
    )    
}

export type LibraryCommand = {
  reload: () => Promise<void>
  updateProblem: (p: Problem) => Promise<void>
  deleteProblems: (ids: ProblemId[]) => Promise<void>
}
//////////////////////////////////////////////////
export function LibraryScreen() {
    const query = useLibraryQueryContext()
    //const controller = useLibraryController(stores.problem)

    const commands: LibraryCommand = {
        reload: useProblemStore(s=>s.reload),
        updateProblem: useProblemStore(s=>s.updateProblem),
        deleteProblems: useProblemStore(s=>s.deleteProblems),
    }
    const [checkboxMode, setCheckboxMode] = useState(false)
    const presenter = useLibraryPresenter(commands)

    const problems = useProblemStore(s => s.all)
    const learningRecords = useLearningRecordStore(s => s.records)
    const libraryItems = useLibraryItems(problems, learningRecords, query)
    const ids = useMemo(() => libraryItems.map(p => p.id), [libraryItems])
    //const allIds = useProblemStore(s => s.ids)

    //const ids = libraryItems.map(p=>p.id)
    const checkboxControl = useLibraryCheckbox(ids)
    const toast = useToast()
    //const selectionController = useSelectItems(libraryItems.map(p=>p.id))
    
    // importer
    const importer = useImportController(async (res: ImportFilesResult) => {
        await commands.reload()
        toast({ message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}` })
    })   

    const deleteChecked = async () => {
        const idsToDelete = checkboxControl.checkedIds
        if (!idsToDelete.length) return
        if (!window.confirm("Are you sure to delete selected?")) return
        const res = await commands.deleteProblems(idsToDelete)
        toast({ message: `Deleted ${res} problems` })
    }

    const itemActions = {
        editTags: (ids: ProblemId[]) => {
            presenter.dialogs.tagEdit.openDialog(ids)
        },
        /*
        deleteMany: async (ids: ProblemId[]) => {
            if (!window.confirm("Are you sure to delete selected?")) return
            const res = await controller.deleteMany(ids)
            toast({ message: `Deleted ${res} problems` })
        },*/
        deleteChecked: deleteChecked
    }
    const handlers = {        
        onSelectAll: checkboxControl.checkAll,
        onClearAll: checkboxControl.uncheckAll,
        onToggleChecked: checkboxControl.toggleChecked,
        onToggleCheckboxMode: () => {
            setCheckboxMode(prev => !prev)
            //checkboxControl.uncheckAll()
        }
    }

    useEffect(() => {
        if (!checkboxMode) checkboxControl.uncheckAll()
    }, [checkboxMode])

    const selection = {
        checkedIds: checkboxControl.checkedIds,
        isChecked: checkboxControl.isChecked,
        isCheckboxMode: checkboxMode
    }
    const onItemClick = (p: Problem) => {
        if (selection.isCheckboxMode) {
            checkboxControl.toggleChecked(p.id)
        } else {
            presenter.dialogs.detail.openDialog(p) 
        }
    }
    console.log("ids", ids)
    return (
        <AppShell
            header="Library"
            rightActions={
                <>
                    <IconButton onClick={presenter.dialogs.backupRestore.openDialog}>
                        <BackupIcon sx={{ color: "white" }} />
                    </IconButton>
                </>
            }
        >
            <LibraryView
                //problems={libraryItems}
                
                ids={ids}
                query={query}
                itemActions={itemActions}
                selectActions={handlers}
                onItemClick={onItemClick}
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
