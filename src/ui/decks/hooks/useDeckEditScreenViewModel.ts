import { useDeckEditorStore } from "@/application/store/useDeckEditorStore"
import { useDeckStore } from "@/application/store/useDeckStore"
import { useProblemStore } from "@/application/store/useProblemStore"
import { useLearningRecordStore } from "@/application/useLearningRecordStore"
import { useQuery } from "@/application/useQuery"
import { createQuerySnapshot, type Deck } from "@/domain/deck/Deck"
import { ProblemStats } from "@/domain/problem/ProblemStats"
import type { QueryContextValue } from "@/ui/App/providers/QueryProvider"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { routes } from "@/ui/App/useAppNavigation"
import { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"


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
function useDeckEditorStats(draft: Deck | null, query: QueryContextValue) {
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
    // Stats
    // --------------------------
    const stats = useDeckEditorStats(draft, query)

    // --------------------------
    // 保存・削除
    // --------------------------
    const { save, remove } = useDeckEditorActions(id, query)

    return {
        id,
        deck: draft,
        name: draft?.name ?? "",
        setName,
        allTags,
        query,
        stats,
        isNew: id === "new",
        handleSaveAndExit: save,
        handleDeleteDeck: remove,
    }
}
