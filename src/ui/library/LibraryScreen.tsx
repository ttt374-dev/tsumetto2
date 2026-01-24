import { LibraryView } from "./components/LibraryView";
import { useToast } from "../App/providers/ToastProvider";
import { useNavigate } from "react-router-dom";
import { useLibraryCheckbox } from "./hooks/useLibraryCheckbox";
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useMemo, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { useProblemStore } from "@/application/store/useProblemStore";
import type { Problem } from "@/domain/problem/Problem";
import { useLearningEventStore } from "@/application/store/useLearningEventStore";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";

//////////////////////////////////////////////////
// LibraryScreen.tsx
export function LibraryScreen() {
    const [checkboxMode, setCheckboxMode] = useState(false)
    const repos = useRepositoryContext()
    const problemStore = useProblemStore(repos.problem)
    const problems = problemStore.problems
    const learningRecords = useLearningEventStore(repos.learningEvent).records
    const importFilesUsecase = createImportProblemsUsecase(repos.problem)
    const query = useLibraryQueryContext()

    const libraryItems: Problem[] = useMemo(() => {            
        return applyQuery(problems, learningRecords, query.sortState, query.filterState)
    }, [problems, learningRecords, query.sortState, query.filterState])

    
    const checkboxControl = useLibraryCheckbox(libraryItems.map(e => e.id))
    const toast = useToast()
    const navigate = useNavigate()

    // --- handlers ---
    const handleDeleteAll = async () => { 
        if (!window.confirm("are you sure to delete")) return
        await runCommand(() => repos.problem.removeAll())
        //await problemStore.reload()
        toast({ message: `delete all problems` })
    }
    const handleDeleteChecked = async() => {
        if (!window.confirm("are you sure to delete")) return
        const deleteIds = Array.from(checkboxControl.checkedIds)
        await runCommand(() => repos.problem.removeMany(deleteIds))
        
        toast({ message: `delete ${deleteIds.length} problems` })
    }
    const handleToggleCheckboxMode = () => {
        setCheckboxMode(prev => !prev)
    }
    const handleImportFiles = async (files: File[]) => {
        await importFilesUsecase.importFiles(files)
        await problemStore.reload()
    }
    // helper
    const runCommand = async (cmd: () => Promise<void>) => {
        await cmd()
        await problemStore.reload()
    }
    /////////
    return (
        <LibraryView
            problems={libraryItems}
            learningRecords={learningRecords}
            query={query}
            onDeleteAll={handleDeleteAll}
            onImportFiles={handleImportFiles}
            onSelect={id => navigate(`/view/${id}`)}

            isChecked={checkboxControl.isChecked}
            checkedIds={checkboxControl.checkedIds}
            onCheckAll={checkboxControl.checkAll}
            onUncheckAll={checkboxControl.uncheckAll}

            isCheckboxMode={checkboxMode}
            onToggleCheckboxMode={handleToggleCheckboxMode}

            onToggleChecked={checkboxControl.toggleChecked}
            onDeleteChecked={handleDeleteChecked}
        />
    )
}
