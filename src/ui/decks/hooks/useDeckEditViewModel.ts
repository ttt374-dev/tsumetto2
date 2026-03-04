import { useDeckEditorStore } from "@/ui/store/useDeckEditorStore"
import { useDeckStore } from "@/ui/store/useDeckStore"
import { useProblemStore } from "@/ui/store/useProblemStore"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { applyQuery } from "@/domain/problem/service/query/applyQuery"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { routes } from "@/ui/App/useAppNavigation"
import { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createQuerySnapshot } from "@/domain/deck/entity/Deck"
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats"
import { useProblemsQuery } from "@/domain/problem/service/query/useProblemsQuery"
import { DefaultQueryState, type QueryState } from "@/domain/problem/service/query/ProblemsQuery"


function useDeckEditorInitializer(id: string | undefined) {
    const { startNew, startEdit, reset } = useDeckEditorStore()
    const decks = useDeckStore(s => s.decks)

    useEffect(() => {
        if (!id) return

        if (id === "new") {
            startNew()
        } else {
            const existing = decks.find(d => d.id === id)
            if (existing) startEdit(existing)
        }

        return () => reset()
    }, [id, decks])
}
function useDeckEditorList(queryState: QueryState){
    const problems = useProblemStore(s => s.activeProblems)
    const learningRecords = useLearningRecordStore(s => s.records)

    const activeProblems = useMemo(() =>
        applyQuery(problems, learningRecords, queryState),
        [problems, learningRecords, queryState])
    const ids = activeProblems.map(p => p.id)
    return { ids, activeProblems, learningRecords}
}

function useDeckEditorActions(id: string | undefined, queryState: QueryState) {
    const draft = useDeckEditorStore(s => s.draft)
    const reset = useDeckEditorStore(s => s.reset)
    const deckStore = useDeckStore()
    const navigate = useNavigate()
    const toast = useToast()
    //const query = useQuery()

    const save = useCallback(async () => {
        if (!draft) return     
        console.log("save draft", draft)   
        deckStore.saveDeck({
            ...draft,
            snapshot: createQuerySnapshot(queryState),
        })

        toast({ message: "保存しました" })
        reset()
        navigate(routes.back)
    }, [draft, deckStore, queryState])

    const remove = useCallback( () => {
        if (!draft || id === "new") return

        if (!window.confirm("are  you sure to delete")) return
        deckStore.deleteDeck(draft.id)
        toast({ message: "削除しました" })
        reset()
        navigate(routes.back)
    }, [draft, id, deckStore])

    return { save, remove }
}


/////////////////////////////////////
export function useDeckEditViewModel() {
    const { id } = useParams<{ id: string }>()
    //const query = useQuery()    
    const query = useProblemsQuery()

    const {
        draft,
        setName,
        reset,
    } = useDeckEditorStore()

    const allTags = useProblemStore(s => s.allTags)
    const allSources = useProblemStore(s=>s.allSources)

    // --------------------------
    // 初期化
    // --------------------------
    useDeckEditorInitializer(id)

    // --------------------------
    // draft → query同期（初回のみ）
    // --------------------------
    useEffect(() => {
        if (!draft?.snapshot.queryState) return

        //query.setAll(draft.snapshot.queryState)
        query.setAll({
            ...DefaultQueryState,
            ...draft.snapshot.queryState
        })
    }, [draft?.id])

    // --------------------------
    // List, Stats
    // --------------------------
    const { ids, learningRecords} = useDeckEditorList(query.state)
    const stats =  useMemo(()=> ProblemStats.create(ids, learningRecords),
        [ids, learningRecords])

    // --------------------------
    // 保存・削除
    // --------------------------
    const { save, remove } = useDeckEditorActions(id, query.state)

    return {
        id,
        deck: draft,
        name: draft?.name ?? "",        
        allTags, allSources,
        query,
        ids, 
        stats,
        isNew: id === "new",

        setName,
        handleSaveAndExit: save,
        handleDeleteDeck: remove,
    }
}
