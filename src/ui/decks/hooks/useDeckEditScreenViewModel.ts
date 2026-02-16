import { useDeckEditorStore } from "@/application/store/useDeckEditorStore"
import { useDeckStore } from "@/application/store/useDeckStore"
import { useProblemStore } from "@/application/store/useProblemStore"
import { useLearningRecordStore } from "@/application/useLearningRecordStore"
import { useQuery } from "@/application/useQuery"
import { createQuerySnapshot } from "@/domain/deck/Deck"
import { ProblemStats } from "@/domain/problem/ProblemStats"
import { useToast } from "@/ui/App/providers/ToastProvider"
import { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"

export function useDeckEditViewModel() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const toast = useToast()
    const query = useQuery()

    const deckStore = useDeckStore()
    const problemStore = useProblemStore()
    const learningRecords = useLearningRecordStore(s => s.records)

    const {
        draft,
        startNew,
        startEdit,
        setName,
        setSnapshot,
        reset,
    } = useDeckEditorStore()

    const allTags = useProblemStore(s => s.allTags)

    // --------------------------
    // 初期化
    // --------------------------
    useEffect(() => {
        if (!id) return

        if (id === "new") {
            startNew()
        } else {
            const existing = deckStore.decks.find(d => d.id === id)
            if (existing) startEdit(existing)
        }

        return () => reset()
    }, [id, deckStore.decks])

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
    const stats = useMemo(() => {
        if (!draft) return { problemCount: 0, accuracy: 0 }

        return ProblemStats.createWithFilter(
            problemStore.all,
            learningRecords,
            query.filterState
        )
    }, [draft, problemStore.all, learningRecords, query.filterState])

    // --------------------------
    // 保存
    // --------------------------
    const handleSaveAndExit = useCallback(async () => {
        if (!draft) return

        const newDeck = {
            ...draft,
            snapshot: createQuerySnapshot(query),
        }

        await deckStore.saveDeck(newDeck)

        toast({ message: "保存しました" })
        reset()
        navigate(-1)
    }, [draft, deckStore, query, navigate, toast])

    // --------------------------
    // 削除（既存のみ）
    // --------------------------
    const handleDeleteDeck = useCallback(async () => {
        if (!draft) return
        if (id === "new") return

        if (!confirm(`デッキ「${draft.name}」を削除しますか？`)) return

        try {
            await deckStore.deleteDeck(draft.id)
            toast({ message: "削除しました" })
            reset()
            navigate(-1)
        } catch {
            toast({ message: "削除に失敗しました" })
        }
    }, [draft, deckStore, navigate, toast, id])

    return {
        id,
        deck: draft,
        name: draft?.name ?? "",
        setName,
        allTags,
        query,
        stats,
        isNew: id === "new",
        handleSaveAndExit,
        handleDeleteDeck,
    }
}
