import { useMissionStore } from "@/ui/mission/hooks/useMissionStore"
import { useProblemStore } from "@/ui/store/useProblemStore"
import { useLearningRecordStore } from "@/ui/domains/learning/useLearningRecordStore"
import { applyQuery } from "@/domain/problem/service/query/applyQuery"
import { useCallback, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats"
import { useProblemsQuery } from "@/ui/common/hooks/useProblemsQuery"
import { DefaultQueryState, type QueryState } from "@/domain/problem/service/query/ProblemsQuery"
import { useMissionEditorStore } from "@/ui/mission/edit/useMissionEditorStore"

const ID_NEW = "new"

function useMissionEditorInitializer(id: string | undefined) {
    const { startNew, startEdit, reset } = useMissionEditorStore()
    const missions = useMissionStore(s => s.missions)

    useEffect(() => {
        if (!id) return

        if (id === ID_NEW) {
            startNew()
        } else {
            const existing = missions.find(d => d.id === id)
            if (existing) startEdit(existing)
        }

        return () => reset()
    }, [id, missions])
}
function useMissionEditorList(queryState: QueryState){
    const problems = useProblemStore(s => s.activeProblems)
    const learningRecords = useLearningRecordStore(s => s.records)

    const activeProblems = useMemo(() =>
        applyQuery(problems, learningRecords, queryState),
        [problems, learningRecords, queryState])
    const ids = activeProblems.map(p => p.id)
    return { ids, activeProblems, learningRecords}
}

function useMissionEditorActions(id: string | undefined, queryState: QueryState) {    
    const draft = useMissionEditorStore(s => s.draft)
    const reset = useMissionEditorStore(s => s.reset)
    const { saveMission, deleteMission } = useMissionStore()

    const save = useCallback(async () => {
        if (!draft) return     
        saveMission({
            ...draft,
            queryState: {...queryState},
        })

        reset()        
    }, [draft, queryState])

    const remove = useCallback( () => {
        if (!draft || id === ID_NEW) return
        deleteMission(draft.id)
        //toast({ message: "削除しました" })
        reset()

    }, [draft, id])

    return { save, remove }
}


/////////////////////////////////////
export function useMissionEditViewModel() {
    const { id } = useParams<{ id: string }>()
    //const query = useQuery()    
    const query = useProblemsQuery()

    const {
        draft,
        setName,
        reset,
    } = useMissionEditorStore()

    const allTags = useProblemStore(s => s.allTags)
    const allSources = useProblemStore(s=>s.allSources)

    // --------------------------
    // 初期化
    // --------------------------
    useMissionEditorInitializer(id)

    // --------------------------
    // draft → query同期（初回のみ）
    // --------------------------
    useEffect(() => {
        if (!draft?.queryState) return

        //query.setAll(draft.snapshot.queryState)
        query.setAll({
            ...DefaultQueryState,
            ...draft.queryState
        })
    }, [draft?.id])

    // --------------------------
    // List, Stats
    // --------------------------
    const { ids, learningRecords} = useMissionEditorList(query.state)
    const stats =  useMemo(()=> ProblemStats.create(ids, learningRecords),
        [ids, learningRecords])

    // --------------------------
    // 保存・削除
    // --------------------------
    const { save, remove } = useMissionEditorActions(id, query.state)

    return {
        id,
        mission: draft,
        name: draft?.name ?? "",        
        allTags, allSources,
        query,
        ids, 
        stats,
        isNew: id === ID_NEW,

        setName,
        save,
        remove,
    }
}
