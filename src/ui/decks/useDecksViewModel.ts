import { useDeckStore } from "@/application/store/useDeckStore";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useMissionStore } from "@/application/store/useMissionStore";
import { useLearningRecordStore } from "@/application/useLearningRecordStore";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { DefaultFilterState } from "@/domain/problem/query/filter";
import { DefaultSortState } from "@/domain/problem/query/sort";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useToast } from "../App/providers/ToastProvider";
import { useImportController } from "@/application/useImportControler";
import { useBackupRestoreDialog } from "../common/dialogs/BackupRestoreDialog";
import type { Deck } from "@/domain/deck/Deck";
import type { ImportFilesResult } from "@/usecase/importProblemsUsecase";
import { useMemo, useCallback } from "react";
import { useDeckStats } from "./hooks/useDeckStats";

export function useDecksViewModel() {
    const navigate = useNavigate();
    const toast = useToast();

    // --- ストア ---
    const problems = useProblemStore(s => s.all);
    const reloadProblems = useProblemStore(s => s.reload);
    const decks = useDeckStore(s => s.decks);
    const saveDeck = useDeckStore(s => s.saveDeck);
    const learningRecords = useLearningRecordStore(s => s.records);
    const startMission = useMissionStore(s => s.start);

    // --- stats ---
    const deckStats = useDeckStats(problems, decks, learningRecords);

    // --- デッキ作成 ---
    const createDeck = useCallback((name: string): Deck => ({
        id: v4(),
        name,
        snapshot: { filterState: DefaultFilterState, sortState: DefaultSortState },
        createdAt: new Date(),
    }), []);

    const handleCreateDeck = useCallback((name: string) => {
        const newDeck = createDeck(name);
        saveDeck(newDeck);
        navigate(`/deck/${newDeck.id}`);
    }, [createDeck, saveDeck, navigate]);

    // --- ミッション開始 ---
    const handleStartMission = useCallback((deck: Deck) => {
        const filtered = applyQuery(problems, learningRecords, deck.snapshot.sortState, deck.snapshot.filterState);
        startMission(deck.id, filtered.map(p => p.id));
        navigate("/mission/play");
    }, [problems, learningRecords, startMission, navigate]);

    // --- インポート ---
    const importer = useImportController(async (res: ImportFilesResult) => {
        await reloadProblems();
        toast({ message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}` });
    });

    // --- バックアップ・リストア ---
    const backupRestoreDialog = useBackupRestoreDialog((res) => {
        if (res.ok) reloadProblems();
    });

    // --- return VM ---
    return {
        decks,
        deckStats,
        handleCreateDeck,
        handleStartMission,
        importer,
        backupRestoreDialog,
    };
}
