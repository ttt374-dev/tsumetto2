import { useDeckStore } from "@/application/store/useDeckStore";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useQuery } from "@/application/useQuery";
import { createQuerySnapshot, type Deck } from "@/domain/deck/Deck";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../App/providers/ToastProvider";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useLearningRecordStore } from "@/application/useLearningRecordStore";
import { v4 } from "uuid";
import { DefaultFilterState } from "@/domain/problem/query/filter";
import { DefaultSortState } from "@/domain/problem/query/sort";

export function useDeckEditViewModel() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const query = useQuery();
    const allTags: string[] = useProblemStore(s=>s.allTags);
    //console.log("alltags", allTags)

    const deckStore = useDeckStore();
    const problemStore = useProblemStore();
    const learningRecords = useLearningRecordStore(s => s.records);

    //const deck = useMemo(() => deckStore.decks.find(d => d.id === id), [deckStore.decks, id]);
        // --- デッキ作成 ---
    const createDeck = useCallback((name: string): Deck => ({
        id: v4(),
        name,
        snapshot: { filterState: DefaultFilterState, sortState: DefaultSortState },
        createdAt: new Date(),
    }), []);

    const [draftDeck] = useState(() =>
        id === "new" ? createDeck("new deck") : undefined
    )

    const deck = (id === "new") ?
        draftDeck :
        deckStore.decks.find(d => d.id === id)

    // --- Deck name state ---
    const [name, setName] = useState(deck?.name ?? "");

    useEffect(() => {
        if (!deck) return
        console.log("ueffect", deck, query)
        setName(deck.name ?? "");
        query.setFilterState(deck.snapshot.filterState);
        query.setSortState(deck.snapshot.sortState);

    }, [id]);

    // --- Stats ---
    const problems = problemStore.all;
    const stats = useMemo(() => {
        if (!deck) return { problemCount: 0, accuracy: 0 };
        return ProblemStats.createWithFilter(problems, learningRecords, query.filterState);
    }, [problems, learningRecords, query, deck]);

    // --- Handlers ---
    const handleSaveAndExit = useCallback(async () => {
        if (!deck) return;

        const newDeck = {
            ...deck,
            name,
            snapshot: createQuerySnapshot(query),
        };

        await deckStore.saveDeck(newDeck);
        toast({ message: "保存しました" });
        navigate(-1);
    }, [deck, name, deckStore, query, navigate, toast]);

    const handleDeleteDeck = useCallback(async () => {
        if (!deck) return;
        if (!confirm(`デッキ「${deck.name}」を削除しますか？`)) return;
        try {
            await deckStore.deleteDeck(deck.id);
            toast({ message: "削除しました" });
            navigate(-1);
        } catch (e) {
            toast({ message: "削除に失敗しました" });
        }
    }, [deck, deckStore, navigate, toast]);

    return {
        id,
        deck,
        name,
        setName,
        allTags,
        query,
        stats,
        handleSaveAndExit,
        handleDeleteDeck,
    };
}
