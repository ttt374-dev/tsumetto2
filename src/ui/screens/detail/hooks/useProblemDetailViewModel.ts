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

export function useProblemDetailViewModel(problem: Problem) {
    // problem store
    //const problem = useProblemStore(s => s.byId[problemId])
    const allTags = useProblemStore(s => s.allTags)
    const allSources = useProblemStore(s => s.allSources)
    const updateField = useProblemEditStore(s => s.updateField)
    
    // learning store    
    //const learningState = useLearningRecordStore(s=>s.getState(problem.id))
    const draft = useProblemEditStore(s=>s.draft)

    useInitializeProblemDraft(problem)
    const view = draft ?? createEditDraft()
    const actions = useProblemEditActions(problem.id, draft)
    const updateFields = useProblemEditFields()
    const toggleStar = useProblemEditStore(s => s.toggleStar)
    const toggleReferenceOnly = useProblemEditStore(s => s.toggleReferenceOnly)

            
    const fields = {
        title: { 
            value: view.title,
            set: (v: string) => updateField("title", v)
        },
        source: {
            value: view.source,
            set: (v: string) => updateField("source", v)
        },
        type: {
            value: view.type,
            set: (v: ProblemType) => updateField("type", v),
        },
        tags: {
            value: view.tags,
            set: (v: string[]) => updateField("tags", v)
        },
        comment: {
            value: view.comment,
            set: (v: string) => updateField("comment", v)
        },

        starred: {
            value: view.starred,
            toggle: toggleStar
        },
        isReferenceOnly: {
            value: view.isReferenceOnly,
            toggle: toggleReferenceOnly,
        }
    }
    return {
        draft, allSources, allTags,
        ...view, ...actions,
        ...updateFields, 
        toggleStar, toggleReferenceOnly,
        fields,       
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

export function useProblemEditActions(pid: ProblemId, draft: ProblemEditDraft | null) {
    const deleteProblems = useProblemStore(s => s.deleteProblems)
    const appendReset = useReviewEventStore(s => s.appendReset)
    const updateProblem = useProblemStore(s => s.updateProblem)
    
    // 学習データリセット
    const resetLearning = () => {
        appendReset(pid)
    }
    const remove = () => {
        deleteProblems([pid])
    }
    const save = async () => {
        if (!draft) return
        updateProblem(pid, prev => applyDraftToProblem(prev, draft))
    }
    return {
        remove, save, resetLearning,
        
    }
}

export function useProblemEditFields() {
    const updateField = useProblemEditStore(s => s.updateField)

    return {
        setTitle: (v: string) => updateField("title", v),
        setSource: (v: string) => updateField("source", v),
        setType: (v: ProblemType) => updateField("type", v),
        setTags: (v: string[]) => updateField("tags", v),
        setComment: (v: string) => updateField("comment", v),
        
    }
}