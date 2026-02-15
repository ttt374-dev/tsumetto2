import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BackupIcon from "@mui/icons-material/Backup";

import { useToast } from "../App/providers/ToastProvider";
import { useLibraryCheckbox } from "./hooks/useLibraryCheckbox";
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useCallback, useEffect, useMemo, useState } from "react";
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

export type LibraryCommand = {
  reload: () => Promise<void>
  updateProblem: (p: Problem) => Promise<void>
  deleteProblems: (ids: ProblemId[]) => Promise<void>
}

export function useLibraryViewModel() {
    const query = useLibraryQueryContext()
    const problems = useProblemStore(s => s.all)
    const learningRecords = useLearningRecordStore(s => s.records)
    const toast = useToast()
    const commands: LibraryCommand = {
        reload: useProblemStore(s => s.reload),
        updateProblem: useProblemStore(s => s.updateProblem),
        deleteProblems: useProblemStore(s => s.deleteProblems)
    }
    const presenter = useLibraryPresenter(commands)

    // -----------------------------
    // ライブラリアイテム
    // -----------------------------
    const libraryItems = useMemo(() =>
        applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, learningRecords, query.sortState, query.filterState]
    )
    const ids = useMemo(() => libraryItems.map(p => p.id), [libraryItems])

    // -----------------------------
    // 選択管理
    // -----------------------------
    const [checkboxMode, setCheckboxMode] = useState(false)
    const checkboxControl = useLibraryCheckbox(ids)
    const selection = useMemo(() => ({
        checkedIds: checkboxControl.checkedIds,
        isChecked: checkboxControl.isChecked,
        isCheckboxMode: checkboxMode
    }), [checkboxControl.checkedIds, checkboxControl.isChecked, checkboxMode])

    // checkboxMode 切替時にチェック解除
    useEffect(() => {
        if (!checkboxMode) checkboxControl.uncheckAll()
    }, [checkboxMode])

    // -----------------------------
    // 操作ハンドラ
    // -----------------------------
    const handlers = useMemo(() => ({
        onSelectAll: checkboxControl.checkAll,
        onClearAll: checkboxControl.uncheckAll,
        onToggleChecked: checkboxControl.toggleChecked,
        onToggleCheckboxMode: () => setCheckboxMode(prev => !prev)
    }), [checkboxControl])

    // -----------------------------
    // アイテムアクション
    // -----------------------------
    const itemActions = useMemo(() => ({
        editTags: (ids: ProblemId[]) => presenter.dialogs.tagEdit.openDialog(ids),
        deleteChecked: async () => {
            const idsToDelete = checkboxControl.checkedIds
            if (!idsToDelete.length) return
            if (!window.confirm("Are you sure to delete selected?")) return
            const res = await presenter.commands.deleteProblems(idsToDelete)
            toast({ message: `Deleted ${res} problems` })
        }
    }), [checkboxControl.checkedIds, presenter.commands, toast])

    // -----------------------------
    // インポート
    // -----------------------------
    const importer = useImportController(async (res: ImportFilesResult) => {
        await presenter.commands.reload()
        toast({
            message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`
        })
    })

    // -----------------------------
    // アイテムクリック
    // -----------------------------
    const onItemClick = useCallback((p: Problem) => {
        if (selection.isCheckboxMode) {
            checkboxControl.toggleChecked(p.id)
        } else {
            presenter.dialogs.detail.openDialog(p)
        }
    }, [selection.isCheckboxMode, checkboxControl, presenter.dialogs.detail])

    return {
        ids,
        query,
        libraryItems,
        selection,
        handlers,
        itemActions,
        onItemClick,
        importer,
        presenter
    }
}

//////////////////////////////////////////////////

export function LibraryScreen() {
    const vm = useLibraryViewModel()

    return (
        <AppShell
            header="Library"
            rightActions={
                <IconButton onClick={vm.presenter.dialogs.backupRestore.openDialog}>
                    <BackupIcon sx={{ color: "white" }} />
                </IconButton>
            }
        >
            <LibraryView
                ids={vm.ids}
                query={vm.query}
                itemActions={vm.itemActions}
                selectActions={vm.handlers}
                onItemClick={vm.onItemClick}
                selection={vm.selection}
            />
            {vm.importer.pickerElement}
            {vm.importer.dialogElement}
            {vm.presenter.dialogs.viewer.dialogElement}
            {vm.presenter.dialogs.detail.dialogElement}
            {vm.presenter.dialogs.tagEdit.dialogElement}
            {vm.presenter.dialogs.backupRestore.dialogElement}
        </AppShell>
    )
}