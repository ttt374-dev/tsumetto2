import { useNavigate } from "react-router-dom";
import { routes } from "@/ui/App/useAppNavigation";

import { applyQuery } from "@/domain/problem/service/query/applyQuery";
import { selectActiveProblems, useProblemStore } from "@/ui/domains/problem/hooks/useProblemStore";
import { useLearningRecordStore } from "@/ui/domains/learning/hooks/useLearningRecordStore";
import type { Mission } from "@/domain/mission/entity/Mission";
import type { MissionExecutionMode } from "@/ui/screens/mission/components/MissionExecutionModeControl";
import { useSessionStore } from "@/ui/screens/session/hooks/useSessionStore";


export function useMissionStarter(){
    const problems = useProblemStore(selectActiveProblems);
    const learningRecords = useLearningRecordStore(s => s.stateRecords);
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