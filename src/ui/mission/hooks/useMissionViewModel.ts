import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../App/providers/ToastProvider";
import { routes } from "@/ui/App/useAppNavigation";
import { arrayMove } from "@dnd-kit/sortable";

import { applyQuery } from "@/domain/problem/service/query/applyQuery";
import { useMissionStore } from "@/ui/mission/hooks/useMissionStore";
import { selectActiveProblems, useProblemStore } from "@/ui/store/useProblemStore";
import { useSessionStore } from "@/ui/session/hooks/useSessionStore";
import { useLearningRecordStore } from "@/ui/store/useLearningRecordStore";
import { applyFilter } from "@/domain/problem/service/query/applyFilter";
import type { Mission } from "@/domain/mission/entity/Mission";
import { ProblemStats } from "@/domain/problem/valueObject/ProblemStats";
import { useImport } from "@/ui/Import/useImport";
import { useBackupRestoreDialog } from "@/ui/common/components/dialogs/BackupRestoreDialog";
import { DefaultQueryState } from "@/domain/problem/service/query/ProblemsQuery";
import type { MissionExecutionMode } from "@/ui/mission/components/MissionExecutionModeControl";

export function useMissionViewModel() {
    const navigate = useNavigate();
    const toast = useToast();

    // Store
    const missions = useMissionStore(s => s.missions);
    const replaceAll = useMissionStore(s => s.replaceAll);

    //const problems = useProblemStore(s => s.activeProblems);
    const problems = useProblemStore(selectActiveProblems);
    const learningRecords = useLearningRecordStore(s => s.records);
    const reloadProblems = useProblemStore(s => s.reload);
    const startSession = useSessionStore(s => s.start);

    // UI 用配列
    const [missionArray, setMissionArray] = useState<Mission[]>([]);

    // missions が更新されたら UI 配列を order 順にセット
    useEffect(() => {
        const sorted = [...missions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setMissionArray(sorted);
    }, [missions]);

    // DnD 完了時に配列更新 + 永続化
    const onDragEnd = useCallback(
        async (activeId: string | number, overId: string | number | null) => {
            if (!overId || activeId === overId) return;

            const oldIndex = missionArray.findIndex(d => d.id === activeId);
            const newIndex = missionArray.findIndex(d => d.id === overId);

            if (oldIndex === -1 || newIndex === -1) return;

            const newArray = arrayMove(missionArray, oldIndex, newIndex);
            setMissionArray(newArray);

            const updated = newArray.map((d, i) => ({ ...d, order: i }));
            replaceAll(updated);
        },
        [missionArray, replaceAll]
    );

    // missionArray に基づく stats
    const missionStats = useMemo(() => {
        const map = new Map<string, ProblemStats>();
        for (const mission of missionArray) {
            
            const filtered = applyFilter(problems, learningRecords, mission.queryState ?? DefaultQueryState);
            const stats = ProblemStats.create(filtered.map(p => p.id), learningRecords);
            map.set(mission.id, stats);
        }
        return map;
    }, [missionArray, problems, learningRecords]);


    // 既存の操作
    const onCreateMission = () => navigate(routes.newMission);

    const onStartSession = (mission: Mission, executionMode: MissionExecutionMode) => {
        const limit = executionMode.type === "partial" ? 
            executionMode.limit : null

        const filtered = applyQuery(
            problems,
            learningRecords,
            mission.queryState, limit);
        startSession(mission.id, filtered.map(p => p.id));
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
        missionArray,
        missionStats,
        onDragEnd,
        onCreateMission,
        onStartSession,
        presenter: { importer, backupRestoreDialog },
    };
}