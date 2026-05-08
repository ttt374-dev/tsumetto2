import { useEffect, useMemo } from 'react';

import { Problem, type ProblemId } from "@/domain/problem/entity/Problem";
import { useProblemStore } from '@/ui/features/problem/hooks/useProblemStore';
import { useReviewEventStore } from '@/ui/features/learning/hooks/useReviewEventStore';
import type { ProblemType } from "@/domain/problem/entity/ProblemType";
import { applyDraftToProblem, createEditDraft, toEditDraft, type ProblemEditDraft } from '@/ui/screens/detail/hooks/useProblemEditDraft';
import { useProblemEditStore } from '@/ui/screens/detail/hooks/useProblemEditStore';
import { projectLearningState } from '@/domain/learning/service/projectLearningState';

export type SourceOption = {
    id: string
    label: string
}

export function useProblemDetailViewModel(problem: Problem) {
    const allTags = useProblemStore(s => s.allTags)
    const allSources = useProblemStore(s => s.allSources)
    const draft = useProblemEditStore(s=>s.draft)
    const updateProblem = useProblemStore(s => s.updateProblem)
    const eventLog = useReviewEventStore(s => s.eventLog)

    const learningState = useMemo(() => {
        const events = eventLog.filter(s => s.problemId === problem.id)

        const records =
            projectLearningState(events)

        return records[problem.id]
    }, [eventLog, problem.id])
    
    const save = async () => {
        if (!draft) return
        updateProblem(problem.id, prev => applyDraftToProblem(prev, draft))
    }
    useInitializeProblemDraft(problem)
    
    return {
        save,
        allSources, allTags,
        learningState,
        fields: useProblemEditFields(draft)
    }
}
//////////////
function useInitializeProblemDraft(problem: Problem){
    // open 時に初期値セット
    useEffect(() => {
        useProblemEditStore
            .getState()
            .setDraft(toEditDraft(problem))


    }, [problem.id])
}

export function useProblemEditActions(pid: ProblemId) {
    const deleteProblems = useProblemStore(s => s.deleteProblems)
    const appendReset = useReviewEventStore(s => s.appendReset)    
    
    // 学習データリセット
    const resetLearning = () => {
        appendReset(pid)
    }
    const remove = () => {
        deleteProblems([pid])
    }

    return {
        remove, resetLearning,        
    }
}

function useProblemEditFields(draft: ProblemEditDraft | null){
    const { updateField, toggleStar, toggleReferenceOnly} = useProblemEditStore()    
    const view = draft ?? createEditDraft()

    return useMemo(()=>({
        // problem
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
        // learning
        referenceOnly: {
            value: view.isReferenceOnly,
            toggle: toggleReferenceOnly
        }
    }),[view, updateField, toggleStar, toggleReferenceOnly])
}