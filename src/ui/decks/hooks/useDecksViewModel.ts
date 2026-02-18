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
export function useDecksViewModel() {
    return {
        ...useDecksQueryVM(),
        ...useDecksCommandVM(),
    };
}
