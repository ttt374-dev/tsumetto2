import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../App/providers/ToastProvider";
import { applyQuery } from "@/domain/problem/service/query/applyQuery";
import { routes } from "@/ui/App/useAppNavigation";

import { arrayMove } from "@dnd-kit/sortable";

import { useDeckStore } from "@/ui/store/useDeckStore";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useMissionStore } from "@/ui/store/useMissionStore";
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore";
import { applyFilter } from "@/domain/problem/service/query/applyFilter";
import type { Deck } from "@/domain/deck/entity/Deck";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { useImportController } from "@/ui/common/components/dialogs/Import/useImportController";
import { useBackupRestoreDialog } from "@/ui/common/components/dialogs/BackupRestoreDialog";

export function useDecksViewModel() {
    const navigate = useNavigate();
    const toast = useToast();

    // Store
    const decks = useDeckStore(s => s.decks);
    const replaceAll = useDeckStore(s => s.replaceAll);

    const problems = useProblemStore(s => s.activeProblems);
    const learningRecords = useLearningRecordStore(s => s.records);
    const reloadProblems = useProblemStore(s => s.reload);
    const startMission = useMissionStore(s => s.start);

    // UI 用配列
    const [deckArray, setDeckArray] = useState<Deck[]>([]);

    // decks が更新されたら UI 配列を order 順にセット
    useEffect(() => {
        const sorted = [...decks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setDeckArray(sorted);
    }, [decks]);

    // DnD 完了時に配列更新 + 永続化
    const onDragEnd = useCallback(
        async (activeId: string | number, overId: string | number | null) => {
            if (!overId || activeId === overId) return;

            const oldIndex = deckArray.findIndex(d => d.id === activeId);
            const newIndex = deckArray.findIndex(d => d.id === overId);

            if (oldIndex === -1 || newIndex === -1) return;

            const newArray = arrayMove(deckArray, oldIndex, newIndex);
            setDeckArray(newArray);

            const updated = newArray.map((d, i) => ({ ...d, order: i }));
            await replaceAll(updated);
        },
        [deckArray, replaceAll]
    );

    // deckArray に基づく stats
    const deckStats = useMemo(() => {
        const map = new Map<string, ProblemStats>();
        for (const deck of deckArray) {
            const filtered = applyFilter(problems, learningRecords, deck.snapshot.filterState);
            const stats = ProblemStats.create(filtered.map(p => p.id), learningRecords);
            map.set(deck.id, stats);
        }
        return map;
    }, [deckArray, problems, learningRecords]);


    // 既存の操作
    const onCreateDeck = () => navigate(routes.deckNew);

    const onStartMission = (deck: Deck) => {
        const filtered = applyQuery(
            problems,
            learningRecords,
            deck.snapshot.sortState,
            deck.snapshot.filterState
        );

        startMission(deck.id, filtered.map(p => p.id));
        navigate(routes.missionPlay);
    };

    const importer = useImportController(async (res) => {
        await reloadProblems();
        toast({
            message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`,
        });
    });

    const backupRestoreDialog = useBackupRestoreDialog(res => {
        if (res.ok) reloadProblems();
    });

    return {
        deckArray,
        deckStats,
        onDragEnd,
        onCreateDeck,
        onStartMission,
        presenter: { importer, backupRestoreDialog },
    };
}