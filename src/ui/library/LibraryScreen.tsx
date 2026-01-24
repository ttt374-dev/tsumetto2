import { LibraryView } from "./components/LibraryView";
import { useToast } from "../App/providers/ToastProvider";
import { useNavigate } from "react-router-dom";
import { useLibraryCheckbox } from "./hooks/useLibraryCheckbox";
import { useExerciseControl } from "@/application/useExerciseControl";
import { useLibraryQueryContext } from "../App/providers/QueryProvider";
import { applyQuery } from "@/domain/Exercise/query/applyQuery";
import { useMemo, useState } from "react";
import { useRepositoryContext } from "../App/providers/RepositoryProvider";
import { createProblemStore } from "@/application/store/useProblemStore";
import type { Problem } from "@/domain/problem/Problem";
import type { Learning } from "@/domain/learning/Learning";
import { createLearningEventStore } from "@/application/store/useLearningEventStore";
import { createImportProblemsUsecase } from "@/usecase/importProblemsUseCase";

type LibraryItem = {
    problem: Problem
    learning?: Learning
}

//////////////////////////////////////////////////
// LibraryScreen.tsx
export function LibraryScreen() {
    const [checkboxMode, setCheckboxMode] = useState(false)

    //const exerciseController = useExerciseControl()
    const repos = useRepositoryContext()
    const problemStore = createProblemStore(repos.problem)
    const problems = problemStore.problems
    const learningRecords = createLearningEventStore(repos.learningEvent).records
    const importFilesUsecase = createImportProblemsUsecase(repos.problem)
    const query = useLibraryQueryContext()
    
    const libraryItems = useMemo(() => {
        
        const items = problems.map(problem => ({
            problem,
            learning: learningRecords?.[problem.id],
        }))
        return applyQuery(items, query.sortState, query.filterState)

    }, [problems, learningRecords])


    
    //const libraryItems = applyQuery(exerciseController.exerciseList, query.sortState, query.filterState)
    const checkboxControl = useLibraryCheckbox(libraryItems.map(e => e.problem.id))
    const toast = useToast()
    const navigate = useNavigate()

    // --- handlers ---
    const handleDeleteAll = () => { 
        if (!window.confirm("are you sure to delete")) return
        problemStore.removeAll()
        toast({ message: `delete all problems` })
    }
    const handleDeleteChecked = () => {
        if (!window.confirm("are you sure to delete")) return
        const deleteIds = Array.from(checkboxControl.checkedIds)
        problemStore.removeMany(deleteIds)
        toast({ message: `delete ${deleteIds.length} problems` })
    }
    const handleToggleCheckboxMode = () => {
        setCheckboxMode(prev => !prev)
    }
    const handleImportFiles = (files: File[]) => {
        importFilesUsecase.importFiles(files)
    }
    /////////
    return (
        <LibraryView
            items={libraryItems}
            query={query}
            onDeleteAll={handleDeleteAll}
            onImportFiles={handleImportFiles}
            onSelect={e => navigate(`/view/${e.problem.id}`)}

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
