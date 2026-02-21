import { useDeckStore } from "@/application/store/useDeckStore";
import { useProblemStore } from "@/application/store/useProblemStore";
import { useMissionStore } from "@/application/store/useMissionStore";
import { useLearningRecordStore } from "@/application/useLearningRecordStore";
import { applyQuery } from "@/domain/problem/query/applyQuery";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../App/providers/ToastProvider";
import { useImportController } from "@/application/useImportControler";
import { useBackupRestoreDialog } from "../../common/dialogs/BackupRestoreDialog";
import type { Deck } from "@/domain/deck/Deck";
import { useDeckStats } from "./useDeckStats";
import { routes } from "@/ui/App/useAppNavigation";
import { useEffect, useState } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export function useDecksQueryVM() {
    const decks = useDeckStore(s => s.decks);
    const problems = useProblemStore(s => s.activeProblems);
    const learningRecords = useLearningRecordStore(s => s.records);

    const deckStats = useDeckStats(problems, decks, learningRecords);

    return {
        decks,
        deckStats,
    };
}

export function useDecksCommandVM() {
    const navigate = useNavigate();
    const toast = useToast();

    const problems = useProblemStore(s => s.activeProblems);
    const learningRecords = useLearningRecordStore(s => s.records);
    const reloadProblems = useProblemStore(s => s.reload);
    const startMission = useMissionStore(s => s.start);

    const onCreateDeck = () => {
        navigate(routes.deckNew);
    };

    const onStartMission = (deck: Deck) => {
        const filtered = applyQuery(
            problems,
            learningRecords,
            deck.snapshot.sortState,
            deck.snapshot.filterState
        );

        startMission(deck.id, filtered.map(p => p.id));
        navigate(routes.missionPlay)

    };

    const importer = useImportController(async (res) => {
        await reloadProblems();
        toast({
            message: `imported: ${res.summary.imported}, skipped: ${res.summary.skipped}, failed: ${res.summary.failed}`
        });
    });

    const backupRestoreDialog = useBackupRestoreDialog(res => {
        if (res.ok) reloadProblems();
    });

    return {
        onCreateDeck,
        onStartMission,
        importer,
        backupRestoreDialog,
    };
}
export function useDecksReordable(decks: Deck[]) {
    const [deckArray, setDeckArray] = useState<Deck[]>([]);
    const replaceAll = useDeckStore(s=>s.replaceAll)

    useEffect(() => {
        // orderでソートしてUIに反映
        const sorted = [...decks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setDeckArray(sorted);
    }, [decks]);

    const onDragEnd = async (activeId: UniqueIdentifier,
        overId: UniqueIdentifier | null) => {

        if (!overId || activeId === overId) return;

        const oldIndex = deckArray.findIndex(d => d.id === activeId);
        const newIndex = deckArray.findIndex(d => d.id === overId);

        const newArray = arrayMove(deckArray, oldIndex, newIndex);
        setDeckArray(newArray);

        // 並び替え後に order を更新して即永続化
        const updated = newArray.map((d, i) => ({ ...d, order: i }));
        await replaceAll(updated);
    };

    return { deckArray, onDragEnd}


}
export function useDecksViewModel() {
    return {
        ...useDecksQueryVM(),
        ...useDecksCommandVM(),
    };
}
