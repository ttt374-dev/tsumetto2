import { useEffect, useState } from 'react';

import { Problem, type ProblemId } from "@/domain/problem/entity/Problem";
import { useProblemStore } from '@/ui/features/problem/hooks/useProblemStore';
import { useLearningRecordStore } from '@/ui/features/learning/hooks/useLearningRecordStore';
import { useReviewEventStore } from '@/ui/features/learning/hooks/useReviewEventStore';
import type { ProblemType } from "@/domain/problem/entity/ProblemType";
import type { ProblemEditDraft } from '@/ui/screens/detail/hooks/useProblemEditDraft';


function toEditDraft(problem: Problem): ProblemEditDraft {
    return {
        title: problem.title,
        tags: problem.tags ?? [],
        starred: problem.isStarred,
        isReferenceOnly: problem.isReferenceOnly,
        type: problem.type ?? "standard",
        source: problem.source ?? "",
        comment: problem.comment,
    }
}

function applyDraftToProblem(
    prev: Problem,
    draft: ProblemEditDraft
): Problem {
    return prev
        .setTitle(draft.title)
        .setSource(draft.source)
        .setTags(draft.tags)
        .setStarred(draft.starred)
        .setReferenceOnly(draft.isReferenceOnly)
        .setType(draft.type)
        .setComment(draft.comment)
}

//////////////////////////

export type SourceOption = {
    id: string
    label: string
}

export function useProblemDetailViewModel(
    problemId: ProblemId,
    open: boolean,
    //onClose: () => void,
) {
    // problem store
    const problem = useProblemStore(s => s.byId[problemId])
    const updateProblem = useProblemStore(s => s.updateProblem)
    const deleteProblems = useProblemStore(s => s.deleteProblems)
    const allTags = useProblemStore(s => s.allTags)
    const allSources = useProblemStore(s => s.allSources)

    // learning store
    const appendReset = useReviewEventStore(s => s.appendReset)  
    const learningState = useLearningRecordStore(s=>s.getState(problem.id))    

    // local state
    const [draft, setDraft] = useState<ProblemEditDraft|null>(null)

    // open 時に初期値セット
    useEffect(() => {
        if (open && problem && !draft) {
            setDraft(toEditDraft(problem))
        }
    }, [open, problem])

    function updateField<K extends keyof ProblemEditDraft>(
        key: K,
        value: ProblemEditDraft[K]
    ) {
        //setDraft(d => ({ ...d!, [key]: value }))
        setDraft(d => {
            if (!d) return d
            return { ...d, [key]: value }
        })
    }
    //////////////////////////////////////////////////////////
    const remove = () => {
        if (!problem) return
        deleteProblems([problem.id])
    }

    const save = async () => {
        if (!problem || !draft) return
        console.log("save problem", draft)
        updateProblem(problemId, prev => applyDraftToProblem(prev, draft))

    }
    const toggleStar = () => {        
        setDraft(d => {
            if (!d) return d
            return { ...d, starred: !d.starred }
        })
    }
    const toggleReferenceOnly = () => {        
        setDraft(d => {
            if (!d) return d
            return { ...d, isReferenceOnly: !d.isReferenceOnly }
        })
    }
    
    // 学習データリセット
    const resetLearning = () => {
        appendReset(problemId)
    }

    return {
        problem, learningState, allSources, allTags,
        title: draft?.title ?? "",
        starred: draft?.starred ?? false,
        isReferenceOnly: draft?.isReferenceOnly ?? false,
        source: draft?.source ?? "",
        type: draft?.type ?? "standard",
        tags: draft?.tags ?? [],
        comment: draft?.comment ?? "",

        remove, save, resetLearning,
        setTitle: (v: string) => updateField("title", v),
        setSource: (v: string) => updateField("source", v),
        setType: (v: ProblemType) => updateField("type", v),
        setTags: (v: string[]) => updateField("tags", v),
        setComment: (v: string) => updateField("comment", v),
        toggleStar, toggleReferenceOnly,
    }
}
