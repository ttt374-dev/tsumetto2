import { useDeckEditorStore } from "@/ui/store/useDeckEditorStore"
import { useDeckStore } from "@/ui/store/useDeckStore"
import { useProblemStore } from "@/ui/store/useProblemStore"
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore"
import { useQuery } from "@/ui/common/hooks/useQuery"
import { createQuerySnapshot, type Deck } from "@/domain/deck/Deck"
import { Learning } from "@/domain/learning/Learning"
import type { ProblemId } from "@/domain/problem/entity/Problem"
import { ProblemStats } from "@/domain/problem/ProblemStats"
import { applyQuery } from "@/domain/problem/service/query/applyQuery"
import type { QueryContextValue } from "@/ui/App/providers/QueryProvider"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { routes } from "@/ui/App/useAppNavigation"
import { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DeckEditScreen } from "../DeckEditScreen"


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
function useDeckEditorList(query: QueryContextValue){
    const problems = useProblemStore(s => s.activeProblems)
    const learningRecords = useLearningRecordStore(s => s.records)

    const activeProblems = useMemo(() =>
        applyQuery(problems, learningRecords, query.sortState, query.filterState),
        [problems, learningRecords, query])
    const ids = activeProblems.map(p => p.id)
    return { ids, activeProblems, learningRecords}
}

function useDeckEditorStats(query: QueryContextValue) {
    //if (!draft) return { problemCount: 0, accuracy: 0 }
    //const { ids, learningRecords} = useDeckEditorList(query)

    /*
    const problems = useProblemStore(s => s.activeProblems)
    const records = useLearningRecordStore(s => s.records)

    return useMemo(() => {
        if (!draft) return { problemCount: 0, accuracy: 0 }
        return ProblemStats.createWithFilter(
            problems,
            records,
            query.filterState
        )
    }, [draft, problems, records, query.filterState])
    */
}
function useDeckEditorActions(id: string | undefined, query: QueryContextValue) {
    const draft = useDeckEditorStore(s => s.draft)
    const reset = useDeckEditorStore(s => s.reset)
    const deckStore = useDeckStore()
    const navigate = useNavigate()
    const toast = useToast()
    //const query = useQuery()

    const save = useCallback(async () => {
        if (!draft) return
        console.log("save", query, createQuerySnapshot(query))
        await deckStore.saveDeck({
            ...draft,
            snapshot: createQuerySnapshot(query),
        })

        toast({ message: "保存しました" })
        reset()
        navigate(routes.back)
    }, [draft, deckStore, query])

    const remove = useCallback(async () => {
        if (!draft || id === "new") return

        await deckStore.deleteDeck(draft.id)
        toast({ message: "削除しました" })
        reset()
        navigate(routes.back)
    }, [draft, id, deckStore])

    return { save, remove }
}


/////////////////////////////////////
export function useDeckEditViewModel() {
    const { id } = useParams<{ id: string }>()
    const query = useQuery()

    const {
        draft,
        setName,
        reset,
    } = useDeckEditorStore()

    const allTags = useProblemStore(s => s.allTags)

    // --------------------------
    // 初期化
    // --------------------------
    useDeckEditorInitializer(id)

    // --------------------------
    // draft → query同期（初回のみ）
    // --------------------------
    useEffect(() => {
        if (!draft) return

        query.setFilterState(draft.snapshot.filterState)
        query.setSortState(draft.snapshot.sortState)
    }, [draft?.id]) // ← 重要：idで依存

    // --------------------------
    // List, Stats
    // --------------------------
    const { ids, learningRecords} = useDeckEditorList(query)
    const stats =  useMemo(()=> ProblemStats.create(ids, learningRecords),
        [ids, learningRecords])

    // --------------------------
    // 保存・削除
    // --------------------------
    const { save, remove } = useDeckEditorActions(id, query)

    return {
        id,
        deck: draft,
        name: draft?.name ?? "",        
        allTags,
        query,
        ids, 
        stats,
        isNew: id === "new",

        setName,
        handleSaveAndExit: save,
        handleDeleteDeck: remove,
    }
}
