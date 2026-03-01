import { type ProblemId, type ProblemType } from "@/domain/problem/entity/Problem";
import { useEffect, useState } from 'react';
import { useProblemStore } from '@/ui/store/useProblemStore';
import { useLearningRecordStore } from '@/ui/store/useLearningRecordStore';
import { useLearningEventStore } from '@/ui/store/useLearningEventStore';
import type { NewLearningEvent } from '@/domain/learning/entity/LearningEvent';
import type { SolvedResult } from '@/domain/learning/entity/Learning';


export function useProblemDetailDialogViewModel(
    problemId: ProblemId,
    open: boolean,
    onClose: () => void,
) {
    // problem store
    const problem = useProblemStore(s => s.byId[problemId])
    const updateProblem = useProblemStore(s => s.updateProblem)
    const deleteProblems = useProblemStore(s => s.deleteProblems)
    const allTags = useProblemStore(s => s.allTags)

    // learning store
    const appendLearning = useLearningEventStore(s => s.append)
    const learningRecords = useLearningRecordStore(s => s.records)
    const learning = problem ? learningRecords[problem.id] : undefined

    // local state
    const [title, setTitle] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [starred, setStarred] = useState(false)
    const [source, setSource] = useState("")
    const [type, setType] = useState<ProblemType>("standard")

    // open 時に初期値セット
    useEffect(() => {
        if (open && problem) {
            setTitle(problem.title)
            setTags(problem.tags ?? [])
            setStarred(problem.starred)
            setSource(problem.source)
        }
    }, [open, problem])

    //////////////////////////////////////////////////////////
    const remove = (confirmFn: () => boolean) => {
        if (!problem || !confirmFn()) return
        deleteProblems([problem.id])
        onClose()
    }

    const save = async () => {
        if (!problem) return
        updateProblem(problemId, prev =>
            prev.setTitle(title)
                .setTags(tags)
                .setStarred(starred)
                .setSource(source)
        )
        onClose()
    }

    // 学習データリセット
    const resetLearning = (confirmFn: () => boolean) => {
        if (!confirmFn()) return
        const event: NewLearningEvent = { type: "reset", problemId }
        appendLearning(event)
    }

    return {
        problem, learning, title, tags, starred, allTags, source, type,
        setTitle, setTags, setStarred, setSource, setType, remove, save, resetLearning,
    }
}
