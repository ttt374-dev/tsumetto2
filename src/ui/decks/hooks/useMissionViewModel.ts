import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../App/providers/ToastProvider";
import { applyQuery } from "@/domain/problem/service/query/applyQuery";
import { routes } from "@/ui/App/useAppNavigation";
import { arrayMove } from "@dnd-kit/sortable";

import { useMissionStore } from "@/ui/store/useMissionStore";
import { useProblemStore } from "@/ui/store/useProblemStore";
import { useSessionStore } from "@/ui/store/useSessionStore";
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore";
import { applyFilter } from "@/domain/problem/service/query/applyFilter";
import type { Mission } from "@/domain/mission/entity/Mission";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { useImport } from "@/ui/Import/useImport";
import { useBackupRestoreDialog } from "@/ui/common/components/dialogs/BackupRestoreDialog";
import { DefaultQueryState } from "@/domain/problem/service/query/ProblemsQuery";

export function useMissionViewModel() {
    const navigate = useNavigate();
    const toast = useToast();

    // Store
    const decks = useMissionStore(s => s.missions);
    const replaceAll = useMissionStore(s => s.replaceAll);

    const problems = useProblemStore(s => s.activeProblems);
    const learningRecords = useLearningRecordStore(s => s.records);
    const reloadProblems = useProblemStore(s => s.reload);
    const startSession = useSessionStore(s => s.start);

    // UI 用配列
    const [deckArray, setDeckArray] = useState<Mission[]>([]);

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
            replaceAll(updated);
        },
        [deckArray, replaceAll]
    );

    // deckArray に基づく stats
    const deckStats = useMemo(() => {
        const map = new Map<string, ProblemStats>();
        for (const deck of deckArray) {
            
            const filtered = applyFilter(problems, learningRecords, deck.queryState ?? DefaultQueryState);
            const stats = ProblemStats.create(filtered.map(p => p.id), learningRecords);
            map.set(deck.id, stats);
        }
        return map;
    }, [deckArray, problems, learningRecords]);


    // 既存の操作
    const onCreateDeck = () => navigate(routes.newMission);

    const onStartSession = (deck: Mission) => {
        const filtered = applyQuery(
            problems,
            learningRecords,
            deck.queryState,            
        );

        startSession(deck.id, filtered.map(p => p.id));
        navigate(routes.sessionPlay);
    };

    const importer = useImport(async (res) => {
        await reloadProblems();
        toast({
            message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`,
        });
    });

    const backupRestoreDialog = useBackupRestoreDialog();

    return {
        deckArray,
        deckStats,
        onDragEnd,
        onCreateDeck,
        onStartSession,
        presenter: { importer, backupRestoreDialog },
    };
}