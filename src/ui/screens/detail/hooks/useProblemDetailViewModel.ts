import { useEffect } from 'react';

import { Problem, type ProblemId } from "@/domain/problem/entity/Problem";
import { useProblemStore } from '@/ui/features/problem/hooks/useProblemStore';
import { useLearningRecordStore } from '@/ui/features/learning/hooks/useLearningRecordStore';
import { useReviewEventStore } from '@/ui/features/learning/hooks/useReviewEventStore';
import type { ProblemType } from "@/domain/problem/entity/ProblemType";
import { applyDraftToProblem, createEditDraft, toEditDraft, type ProblemEditDraft } from '@/ui/screens/detail/hooks/useProblemEditDraft';
import { useProblemEditStore } from '@/ui/screens/detail/hooks/useProblemEditStore';

export type SourceOption = {
    id: string
    label: string
}

export function useProblemDetailViewModel(problemId: ProblemId) {
    // problem store
    const problem = useProblemStore(s => s.byId[problemId])
    const allTags = useProblemStore(s => s.allTags)
    const allSources = useProblemStore(s => s.allSources)
    const updateField = useProblemEditStore(s => s.updateField)
    
    // learning store    
    const learningState = useLearningRecordStore(s=>s.getState(problem.id))
    const draft = useProblemEditStore(s=>s.draft)

    useInitializeProblemDraft(problem)
    const view = draft ?? createEditDraft()
    const actions = useProblemEditActions(problem, draft)
    return {
        problem, learningState, allSources, allTags,
        ...view, ...actions,
        
        setTitle: (v: string) => updateField("title", v),
        setSource: (v: string) => updateField("source", v),
        setType: (v: ProblemType) => updateField("type", v),
        setTags: (v: string[]) => updateField("tags", v),
        setComment: (v: string) => updateField("comment", v),        
    }
}
//////////////
function useInitializeProblemDraft(problem: Problem){
    // open 時に初期値セット
    useEffect(() => {
        if (problem) {
            useProblemEditStore
                .getState()
                .setDraft(toEditDraft(problem))
        }

    }, [open, problem])
}

function useProblemEditActions(problem: Problem, draft: ProblemEditDraft | null) {
    const deleteProblems = useProblemStore(s => s.deleteProblems)
    const appendReset = useReviewEventStore(s => s.appendReset)
    const updateProblem = useProblemStore(s => s.updateProblem)
    const toggleStar = useProblemEditStore(s => s.toggleStar)
    const toggleReferenceOnly = useProblemEditStore(s=>s.toggleReferenceOnly)

    // 学習データリセット
    const resetLearning = () => {
        appendReset(problem.id)
    }
    const remove = () => {
        if (!problem) return
        deleteProblems([problem.id])
    }
    const save = async () => {
        if (!problem || !draft) return
        console.log("save problem", draft)
        updateProblem(problem.id, prev => applyDraftToProblem(prev, draft))
    }
    return {
        remove, save, resetLearning,
        toggleStar, toggleReferenceOnly,
    }
}   