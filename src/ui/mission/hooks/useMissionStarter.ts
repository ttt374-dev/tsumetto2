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


export function useMissionStarter(){
    const problems = useProblemStore(selectActiveProblems);
    const learningRecords = useLearningRecordStore(s => s.records);
    const navigate = useNavigate()
    
    const start = useSessionStore(s => s.start);

    const startMission = (mission: Mission, executionMode: MissionExecutionMode) => {
        const limit = executionMode.type === "partial" ?
            executionMode.limit : null

        const filtered = applyQuery(
            problems,
            learningRecords,
            mission.queryState, limit);
        start(mission.id, filtered.map(p => p.id));
        navigate(routes.sessionPlay);
    };

    return { startMission }
}