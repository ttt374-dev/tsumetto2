import { Problem, type ProblemDTO, type ProblemId } from "@/domain/problem/entity/Problem";
import { useEffect, useMemo, useState } from 'react';
import { useProblemStore } from '@/ui/store/useProblemStore';
import { useLearningRecordStore } from '@/ui/store/useLearningRecordStore';
import { useReviewEventStore } from '@/ui/store/useReviewEventStore';
import type { ProblemType } from "@/domain/problem/entity/ProblemType";

type ProblemEditDraft = {
    title: string
    tags: string[]
    starred: boolean
    type: ProblemType
    source: string
}
function toEditDraft(problem: Problem): ProblemEditDraft {
  return {
    title: problem.title,
    tags: problem.tags ?? [],
    starred: problem.starred,
    type: problem.type ?? "standard",
    source: problem.source ?? "",
  }
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
    //const activeProblems = useProblemStore(s=>s.activeProblems)
    const updateProblem = useProblemStore(s => s.updateProblem)
    const deleteProblems = useProblemStore(s => s.deleteProblems)
    const allTags = useProblemStore(s => s.allTags)
    const allSources = useProblemStore(s => s.allSources)
    //const allSources = useProbl

    // learning store
    const appendReset = useReviewEventStore(s => s.appendReset)
    const learningRecords = useLearningRecordStore(s => s.records)
    const learning = problem ? learningRecords[problem.id] : undefined

    // local state
    const [draft, setDraft] = useState<ProblemEditDraft>()

    //const [title, setTitle] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [starred, setStarred] = useState(false)
    const [source, setSource] = useState("")
    const [type, setType] = useState<ProblemType>("standard")
    const [comment, setComment] = useState("")

    // open 時に初期値セット
    useEffect(() => {
        if (open && problem) {
            start()
        }
    }, [open, problem])

    function updateField<K extends keyof ProblemEditDraft>(
        key: K,
        value: ProblemEditDraft[K]
    ) {
        setDraft(d => ({ ...d!, [key]: value }))
    }
    //////////////////////////////////////////////////////////
    const start = () => {

        setDraft(toEditDraft(problem))

        //setTitle(problem.title)
        setTags(problem.tags ?? [])
        setStarred(problem.starred)
        setType(problem.type ?? "standard")
        setSource(problem.source ?? "")
    }
    const remove = () => {
        if (!problem) return
        deleteProblems([problem.id])
        //onClose()
    }

    const save = async () => {
        if (!problem) return
        console.log("save problem", problem, starred)
        //console.log("save source", source)
        
        updateProblem(problemId, prev =>
            prev.setTitle(draft?.title ?? "")
                .setTags(tags)
                .setStarred(starred)
                .setSource(source)
        )
        
        //onClose()
    }
    const toggleStar = () => {
        setStarred(prev => !prev)
    }
    // 学習データリセット
    const resetLearning = () => {
        appendReset(problemId)
    }

    return {
        problem, learning, allSources,
        title: draft?.title ?? "",
        //title, 
        tags, starred, allTags, type, source,  comment,
        remove, save, resetLearning, 
        setTitle: (v: string) => updateField("title", v),
        setTags, setType, setSource, setComment, toggleStar,
    }
}
