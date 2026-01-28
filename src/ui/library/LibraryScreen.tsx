import AddIcon from "@mui/icons-material/Add"
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";

import { LibraryView } from "./components/LibraryView";
import { useToast } from "../App/providers/ToastProvider";
import { useNavigate } from "react-router-dom";
import { useLibraryCheckbox } from "./hooks/useLibraryCheckbox";
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useMemo, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { useImporter } from "@/application/useImporter";
import { useMissionEventStoreContext } from "../App/providers/MissionEventStoreProvider";
import { AppLayout } from "../common/AppLayout";
import { Fab, IconButton } from "@mui/material";
import { useMissionEventStore } from "@/application/store/useMissionEventStore";
import { useProblemDetailDialog } from "../common/useProblemDetailDialog";
import type { Problem, ProblemId } from "@/domain/problem/Problem";
import { useViewerDialog } from "../viewer/ViewDialog";

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
    const detailDialog = useProblemDetailDialog(async (p: Problem)=>{
        await repos.problem.update(p)
        await problemStore.reload()
    }) // TODO

    const libraryItems = useMemo(
        () => applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, learningRecords, query.sortState, query.filterState]
    )

    const checkboxControl = useLibraryCheckbox(libraryItems.map(p => p.id))
    const toast = useToast()
    const navigate = useNavigate()
    const importer = useImporter((files: File[]) => { problemStore.reload() })

    const handlers = {
        //view: { onViewProblem: (id: string) => navigate(`/view/${id}`) },
        view: { onViewProblem: (id: string) => { detailDialog.openDialog(id)}},
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
            onToggleCheckboxMode: () => setCheckboxMode(prev => !prev)
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
                    <IconButton onClick={handlers.import.onOpenImportFileDialog}>
                        <AddOutlinedIcon sx={{ color: "#fff" }}/>
                    </IconButton>
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
            {importer.inputElement}
            {viewerDialog.dialogElement}
            {detailDialog.dialogElement}
        </>
    )
}
