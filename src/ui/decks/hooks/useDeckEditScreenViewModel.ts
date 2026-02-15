import { useDeckStore } from "@/application/store/useDeckStore";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useQuery } from "@/application/useQuery";
import { createQuerySnapshot } from "@/domain/deck/Deck";
import { ProblemStats } from "@/domain/problem/ProblemStats";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../App/providers/ToastProvider";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useLearningRecordStore } from "@/application/useLearningRecordStore";

export function useDeckEditViewModel() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const query = useQuery();

    const deckStore = useDeckStore();
    const problemStore = useProblemStore();
    const learningRecords = useLearningRecordStore(s => s.records);

    const deck = useMemo(() => deckStore.decks.find(d => d.id === id), [deckStore.decks, id]);

    // --- Deck name state ---
    const [name, setName] = useState(deck?.name ?? "");

    useEffect(() => {
        if (deck) {
            setName(deck.name ?? "");
            query.setFilterState(deck.snapshot.filterState);
            query.setSortState(deck.snapshot.sortState);
        }
    }, [deck, query]);

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
        query,
        stats,
        handleSaveAndExit,
        handleDeleteDeck,
    };
}
